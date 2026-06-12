/**
 * /privacy — plain-language privacy policy (code-split lazy chunk).
 *
 * Accuracy notes (verified against src/lib/backup.js, src/lib/storage.js,
 * src/lib/cloud/config.js, and docs/CLOUD-SETUP.md):
 *
 * - Guest data lives in browser localStorage under the "nadya:" prefix.
 * - When signed in, data is mirrored to a Supabase project (region ap-southeast-1,
 *   Singapore) via a per-user RLS-protected kv table. Row-level security means
 *   no other user can read your rows; cross-user reads return 0 rows (verified).
 * - No analytics, no tracking scripts, no third-party pixels.
 * - Export is the full JSON in src/lib/backup.js (buildExport / downloadExport).
 * - Guest: clear browser data. Signed-in: delete account by emailing the owner.
 */

import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { PublicBackdrop } from "../components/fx/PublicBackdrop.jsx";

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <h2 className="font-serif text-base font-bold text-cream">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <div className="mx-auto max-w-md px-4 pb-16 pt-[max(2rem,env(safe-area-inset-top))]">
      <PublicBackdrop />

      {/* Back nav */}
      <Link
        to="/welcome"
        viewTransition
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted hover:text-cream"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Back
      </Link>

      <h1 className="font-serif text-2xl font-bold text-cream">Privacy</h1>
      <p className="mt-1 text-xs text-muted">Last updated June 2026</p>

      <div className="mt-6 space-y-6">

        <Section title="Where your data lives">
          <p>
            <span className="font-semibold text-cream">Guest mode (default):</span> everything
            stays on your device — in your browser&apos;s local storage,
            under a <code className="rounded bg-surface2 px-1 py-0.5 text-xs">nadya:</code> namespace.
            Nothing is sent anywhere.
          </p>
          <p>
            <span className="font-semibold text-cream">Signed in:</span> your data is
            mirrored to a Supabase database (region ap-southeast-1, Singapore)
            so you can access it across devices. Only you can read your rows —
            row-level security enforces this at the database level, and it is
            tested. Your device&apos;s local storage remains the source of truth;
            the cloud is a mirror.
          </p>
        </Section>

        <Section title="Tracking and analytics">
          <p>
            None. There are no analytics scripts, no tracking pixels, no
            third-party cookies, no session recordings. Your usage patterns stay
            on your device.
          </p>
        </Section>

        <Section title="What is stored">
          <p>
            Activities, habits, journal entries, savings records, tracker logs,
            and settings — the same data you see inside the app. A backup export
            shows the exact structure.
          </p>
          <p>
            When signed in, authentication is via a 6-digit email OTP code
            (no passwords stored). Your email address is held by Supabase only
            for authentication; it is not used for marketing.
          </p>
        </Section>

        <Section title="Exporting your data">
          <p>
            Go to <span className="font-semibold text-cream">Settings → Export</span> at
            any time to download a complete JSON backup of everything you&apos;ve
            logged. No account needed — guests can export too.
          </p>
        </Section>

        <Section title="Deleting your data">
          <p>
            <span className="font-semibold text-cream">Guest:</span> clearing your
            browser&apos;s site data removes everything. In Chrome/Safari, this
            is under Settings → Privacy → Clear browsing data, then choose this
            site.
          </p>
          <p>
            <span className="font-semibold text-cream">Signed in:</span> email{" "}
            <a
              href="mailto:hassansardarshah1@gmail.com"
              className="text-rose-bright underline-offset-2 hover:underline"
            >
              hassansardarshah1@gmail.com
            </a>{" "}
            from the address you signed up with and your account and all cloud
            data will be deleted within 7 days. Your device&apos;s local storage
            is unaffected — clear that separately if you wish.
          </p>
        </Section>

        <Section title="Third parties">
          <p>
            Google Fonts (Baloo 2 + Figtree) are loaded from Google&apos;s CDN — a
            standard browser request; Google&apos;s own privacy policy applies to
            that request. No other third-party services receive your data.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            If this policy changes meaningfully, the &ldquo;Last updated&rdquo; date
            above will change. Petalfall does not have a mailing list — check back
            here if you want to stay informed.
          </p>
        </Section>

      </div>

      {/* Footer nav */}
      <div className="mt-8 text-center">
        <Link
          to="/"
          viewTransition
          className="inline-block rounded-xl bg-rose px-5 py-2.5 text-sm font-semibold text-ink active:scale-95"
        >
          Open Petalfall
        </Link>
      </div>
    </div>
  );
}
