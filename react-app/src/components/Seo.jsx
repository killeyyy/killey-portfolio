import { useEffect } from "react";

/**
 * Per-route SEO for the SPA. index.html ships a single static <head> with the
 * home page's title/description/canonical, so every route inherits it — and the
 * canonical even points /bmla at "/", flagging it as a duplicate of the home
 * page. This updates title + description + canonical (and the matching OG/Twitter
 * tags) per route for JS-rendering crawlers, and restores the previous values on
 * unmount so routes without <Seo> keep the static defaults.
 *
 * Note: this runs client-side, so it improves Google (which renders JS) and the
 * browser tab — not non-JS social-unfurl scrapers, which read the raw HTML.
 * True per-route unfurls would need prerendering/SSR.
 */
function patchAttr(el, attr, value, restores) {
  if (!el) return;
  const prev = el.getAttribute(attr);
  el.setAttribute(attr, value);
  restores.push(() => (prev == null ? el.removeAttribute(attr) : el.setAttribute(attr, prev)));
}

export default function Seo({ title, description, canonical }) {
  useEffect(() => {
    const head = document.head;
    const restores = [];
    const prevTitle = document.title;

    if (title) {
      document.title = title;
      patchAttr(head.querySelector('meta[property="og:title"]'), "content", title, restores);
      patchAttr(head.querySelector('meta[name="twitter:title"]'), "content", title, restores);
    }
    if (description) {
      patchAttr(head.querySelector('meta[name="description"]'), "content", description, restores);
      patchAttr(head.querySelector('meta[property="og:description"]'), "content", description, restores);
      patchAttr(head.querySelector('meta[name="twitter:description"]'), "content", description, restores);
    }
    if (canonical) {
      const url = canonical.startsWith("http")
        ? canonical
        : (typeof window !== "undefined" ? window.location.origin : "") + canonical;
      patchAttr(head.querySelector('link[rel="canonical"]'), "href", url, restores);
      patchAttr(head.querySelector('meta[property="og:url"]'), "content", url, restores);
    }

    return () => {
      document.title = prevTitle;
      restores.forEach((fn) => fn());
    };
  }, [title, description, canonical]);

  return null;
}
