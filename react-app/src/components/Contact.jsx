import { site } from "../data/site.js";

export default function Contact() {
  function onSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = encodeURIComponent(data.get("name") || "");
    const body = encodeURIComponent(`${data.get("message") || ""}\n\n— ${data.get("name") || ""} (${data.get("email") || ""})`);
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project enquiry from ${name}`)}&body=${body}`;
  }

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line/50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-crimson/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-content px-6 py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-gold">Contact</p>
            <h2 className="text-fluid-xl font-semibold leading-tight text-silver">
              Have something to build? Let's make it cinematic.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Tell me what you're imagining — a game, a site, a brand. I reply to real messages.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {site.emails.map((e) => (
                <li key={e}>
                  <a href={`mailto:${e}`} className="text-silver underline-offset-4 hover:text-crimson hover:underline">
                    {e}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="sr-only">Your name</span>
                <input name="name" required placeholder="Your name" className="w-full rounded-lg border border-line/70 bg-surface/60 px-4 py-3 text-sm text-silver placeholder:text-muted focus:border-crimson/60" />
              </label>
              <label className="block">
                <span className="sr-only">Your email</span>
                <input type="email" name="email" required placeholder="Your email" className="w-full rounded-lg border border-line/70 bg-surface/60 px-4 py-3 text-sm text-silver placeholder:text-muted focus:border-crimson/60" />
              </label>
            </div>
            <label className="block">
              <span className="sr-only">Message</span>
              <textarea name="message" required rows={5} placeholder="What do you want to build?" className="w-full rounded-lg border border-line/70 bg-surface/60 px-4 py-3 text-sm text-silver placeholder:text-muted focus:border-crimson/60" />
            </label>
            <button type="submit" className="w-full rounded-full bg-crimson px-5 py-3 text-sm font-medium text-silver transition-colors hover:bg-crimson/90 sm:w-auto">
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
