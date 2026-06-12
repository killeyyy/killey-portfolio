// Node logic tests for Ruang Pro plumbing (lib/license.js).
// Run from nadya-dashboard/: `npm run test:data`.
import assert from "node:assert/strict";

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

const calls = [];
let script = [];
globalThis.fetch = async (url, opts) => {
  calls.push({ url, opts });
  const next = script.shift();
  if (next instanceof Error) throw next;
  return { ok: next.status < 400, status: next.status, json: async () => next.body ?? {} };
};

const lic = await import("../src/lib/license.js");

// ---- defaults: nothing configured → no gate, no activation ----
assert.equal(lic.isPro(), false);
assert.equal(lic.canActivate(), false);
await assert.rejects(() => lic.activate("KEY"), /isn't open yet/);
assert.equal(calls.length, 0, "no network call without a verifier");
console.log("OK closed-by-default");

// ---- founding stamp: only while the checkout window is open ----
lic.stampFounding({ checkoutUrl: "" });
assert.equal(lic.isFounding(), true);
mem.delete("nadya:founding");
lic.stampFounding({ checkoutUrl: "https://gum.co/ruang" });
assert.equal(lic.isFounding(), false, "no stamp once checkout is live");
console.log("OK founding stamp window");

// ---- activation against a configured verifier (LS + Gumroad shapes) ----
const lsPro = { checkoutUrl: "x", licenseVerify: { url: "https://api.ls/validate", productId: "" } };
script = [{ status: 200, body: { valid: true } }];
const a = await lic.activate("  LS-KEY-1  ", lsPro);
assert.equal(a.key, "LS-KEY-1"); // trimmed
assert.equal(lic.isPro(), true);
assert.equal(calls[0].url, "https://api.ls/validate");
assert.ok(String(calls[0].opts.body).includes("license_key=LS-KEY-1"));

lic.deactivate();
const gumPro = { checkoutUrl: "x", licenseVerify: { url: "https://api.gum/verify", productId: "prod_1" } };
script = [{ status: 200, body: { success: true } }];
await lic.activate("GUM-KEY", gumPro);
assert.ok(String(calls[1].opts.body).includes("product_id=prod_1"));
assert.equal(lic.isPro(), true);
console.log("OK activation LS + Gumroad shapes");

// ---- a rejected key stores nothing ----
lic.deactivate();
script = [{ status: 404, body: { success: false, message: "That license does not exist." } }];
await assert.rejects(() => lic.activate("BAD", gumPro), /does not exist/);
assert.equal(lic.isPro(), false);
console.log("OK rejection stores nothing");

console.log("\nAll license tests passed ✓");
