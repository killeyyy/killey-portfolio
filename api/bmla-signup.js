// BMLA Mastery beta signup. Graceful by design: validates the email, notifies
// the owner via Resend when RESEND_API_KEY is set, and ALWAYS returns 200 so
// the beta flow never breaks if no delivery token is configured.
// Secrets live in Vercel env only — never in the client bundle.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method" });
  }

  const email = String(req.body?.email || "").trim().slice(0, 254);
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, error: "invalid-email" });
  }

  const KEY = process.env.RESEND_API_KEY;
  const TO = process.env.BMLA_NOTIFY_EMAIL || "hassansardarshah1@gmail.com";
  if (KEY) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "BMLA Mastery <onboarding@resend.dev>",
          to: [TO],
          subject: `BMLA beta signup: ${email}`,
          text: `New BMLA Mastery beta signup: ${email}\nTime: ${new Date().toISOString()}`,
        }),
      });
    } catch {
      // delivery is best-effort; the signup itself still succeeds
    }
  }

  return res.status(200).json({ ok: true });
}
