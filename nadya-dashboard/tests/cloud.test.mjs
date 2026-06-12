// Node logic tests for the hand-rolled auth client (lib/cloud/auth.js).
// Run from nadya-dashboard/: `npm run test:data`.
import assert from "node:assert/strict";

// localStorage shim (sessions persist through the storage seam).
const mem = new Map();
globalThis.window = {
  localStorage: {
    getItem: (k) => (mem.has(k) ? mem.get(k) : null),
    setItem: (k, v) => mem.set(k, String(v)),
    removeItem: (k) => mem.delete(k),
    key: (i) => [...mem.keys()][i] ?? null,
    get length() {
      return mem.size;
    },
  },
};

// fetch stub: records calls, plays back a scripted response per call.
const calls = [];
let script = [];
globalThis.fetch = async (url, opts) => {
  calls.push({ url, opts });
  const next = script.shift();
  if (next instanceof Error) throw next;
  return {
    ok: next.status < 400,
    status: next.status,
    json: async () => next.body ?? {},
  };
};

const auth = await import("../src/lib/cloud/auth.js");
const { SUPABASE_URL, SUPABASE_KEY } = await import("../src/lib/cloud/config.js");

// ---- requestCode: right endpoint, key header, normalized email ----
script = [{ status: 200, body: {} }];
await auth.requestCode("  Nadya@Example.com ");
assert.equal(calls[0].url, `${SUPABASE_URL}/auth/v1/otp`);
assert.equal(calls[0].opts.headers.apikey, SUPABASE_KEY);
assert.deepEqual(JSON.parse(calls[0].opts.body), {
  email: "nadya@example.com",
  create_user: true,
});
console.log("OK requestCode shape");

// ---- verifyCode: session saved through the storage seam, not in backups ----
script = [
  {
    status: 200,
    body: {
      access_token: "at1",
      refresh_token: "rt1",
      expires_in: 3600,
      user: { id: "u1", email: "nadya@example.com" },
    },
  },
];
const session = await auth.verifyCode("nadya@example.com", " 123456 ");
assert.equal(session.accessToken, "at1");
assert.equal(session.email, "nadya@example.com");
assert.ok(session.expiresAt > Date.now() + 3000 * 1000);
assert.ok(mem.has("nadya:session"));
// backup.js whitelists keys explicitly — session must not be one of them.
const backupSrc = await import("node:fs").then((fs) =>
  fs.readFileSync(new URL("../src/lib/backup.js", import.meta.url), "utf8"),
);
assert.ok(!backupSrc.includes('"session"'), "session must never enter backups");
console.log("OK verifyCode + session storage");

// ---- shouldRefresh boundary ----
assert.equal(auth.shouldRefresh(null), false);
assert.equal(auth.shouldRefresh({ expiresAt: Date.now() + 10 * 60 * 1000 }), false);
assert.equal(auth.shouldRefresh({ expiresAt: Date.now() + 2 * 60 * 1000 }), true);
console.log("OK shouldRefresh");

// ---- ensureFreshSession: fresh session → no network call ----
const before = calls.length;
const fresh = await auth.ensureFreshSession();
assert.equal(calls.length, before);
assert.equal(fresh.accessToken, "at1");

// Near expiry + NETWORK failure → stale session kept (never sign out offline).
mem.set(
  "nadya:session",
  JSON.stringify({ accessToken: "at1", refreshToken: "rt1", expiresAt: Date.now() + 60_000, email: "e", userId: "u" }),
);
script = [new TypeError("Failed to fetch")];
const offline = await auth.ensureFreshSession();
assert.equal(offline.accessToken, "at1");
assert.ok(mem.has("nadya:session"));
console.log("OK offline never signs out");

// Near expiry + server REJECTION → signed out for real.
script = [{ status: 400, body: { error_description: "Invalid Refresh Token" } }];
const rejected = await auth.ensureFreshSession();
assert.equal(rejected, null);
assert.ok(!mem.has("nadya:session"));
console.log("OK definitive rejection signs out");

// ---- signOut clears locally even when the network is down ----
mem.set(
  "nadya:session",
  JSON.stringify({ accessToken: "at1", refreshToken: "rt1", expiresAt: Date.now() + 9e6, email: "e", userId: "u" }),
);
script = [new TypeError("Failed to fetch")];
await auth.signOut();
assert.ok(!mem.has("nadya:session"));
console.log("OK signOut is local-first");

console.log("\nAll cloud auth tests passed ✓");
