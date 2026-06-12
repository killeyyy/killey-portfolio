import { useState } from "react";
import { Cloud, LogOut } from "lucide-react";
import { Tile } from "../ui/Tile.jsx";
import { Field, TextInput } from "../ui/Field.jsx";
import { useToast } from "../ui/Toast.jsx";
import { buzz } from "../../lib/celebrate.js";
import { getSession, requestCode, signOut, verifyCode } from "../../lib/cloud/auth.js";
import * as storage from "../../lib/storage.js";

/**
 * Account section on Settings (lazy chunk — auth code stays out of the main
 * bundle). Guest mode is the default and never nagged: this tile is the ONLY
 * place sign-in exists. Sync itself ships in the next update; signing in
 * today just reserves her space.
 */
export default function AccountTile() {
  const toast = useToast();
  const [session, setSession] = useState(() => getSession());
  const [stage, setStage] = useState("email"); // "email" | "code"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const sendCode = async () => {
    setBusy(true);
    try {
      await requestCode(email);
      setStage("code");
      toast.show("Code sent — check your email");
    } catch (err) {
      toast.show(err.message || "Couldn't send the code — try again.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    try {
      setSession(await verifyCode(email, code));
      setStage("email");
      setCode("");
      buzz();
      toast.show("Signed in ✓ — bringing your space together…");
      // Lossless first merge (newest-wins per key; local snapshots kept
      // under migrated:*), then one reload so the UI shows merged data.
      const { firstSync } = await import("../../lib/cloud/sync.js");
      await firstSync();
      window.location.reload();
    } catch (err) {
      toast.show(err.message || "That code didn't match — try again.");
    } finally {
      setBusy(false);
    }
  };

  if (session) {
    const pending = Object.keys(storage.get("syncDirty", {})).length;
    const lastPull = storage.get("syncMeta")?.lastPullAt;
    return (
      <Tile
        title="Account"
        action={
          <span className="text-xs tabular-nums text-muted">
            {pending
              ? `${pending} change${pending === 1 ? "" : "s"} waiting to sync`
              : lastPull
                ? "synced ✓"
                : ""}
          </span>
        }
      >
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky/15" aria-hidden="true">
            <Cloud size={18} className="text-sky" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-cream">{session.email}</p>
            <p className="text-xs text-muted">
              Sync is on — your space follows you to any device. Newest change wins; this
              device always keeps its own copy too.
            </p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await signOut();
              setSession(null);
              toast.show("Signed out — your data stays on this device.");
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-xl border border-line px-3 py-1.5 text-xs font-semibold text-cream active:scale-95"
          >
            <LogOut size={13} aria-hidden="true" /> Sign out
          </button>
        </div>
      </Tile>
    );
  }

  return (
    <Tile title="Account" action={<span className="text-xs text-muted">optional, always</span>}>
      <p className="mb-3 text-xs text-muted">
        Ruang works fully on this device, signed in or not. Sign in and your space quietly
        follows you to any device — newest change wins, nothing is ever lost.
      </p>
      {stage === "email" ? (
        <div className="flex items-end gap-2">
          <div className="min-w-0 flex-1">
            <Field label="Email">
              <TextInput
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </Field>
          </div>
          <button
            type="button"
            disabled={busy || !/.+@.+\..+/.test(email)}
            onClick={sendCode}
            className="shrink-0 rounded-xl bg-rose px-4 py-2.5 text-sm font-semibold text-ink active:scale-95 disabled:opacity-40"
          >
            {busy ? "Sending…" : "Send code"}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <Field label={`6-digit code sent to ${email}`}>
            <TextInput
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="••••••"
              className="text-center text-lg tracking-[0.4em]"
            />
          </Field>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setStage("email");
                setCode("");
              }}
              className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-muted active:scale-95"
            >
              Back
            </button>
            <button
              type="button"
              disabled={busy || code.length !== 6}
              onClick={verify}
              className="flex-[2] rounded-xl bg-rose py-2.5 text-sm font-semibold text-ink active:scale-95 disabled:opacity-40"
            >
              {busy ? "Checking…" : "Sign in"}
            </button>
          </div>
        </div>
      )}
    </Tile>
  );
}
