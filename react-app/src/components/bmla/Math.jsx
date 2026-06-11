import { useEffect, useState, memo } from "react";

// KaTeX is lazy-loaded the first time a math block mounts, so the rest of the
// site (and the /bmla landing) pays zero KaTeX cost. Module-level cache means
// we import once per session.
let katexPromise = null;
function loadKatex() {
  if (!katexPromise) {
    katexPromise = Promise.all([
      import("katex"),
      import("katex/dist/katex.min.css"),
    ]).then(([k]) => k.default || k);
  }
  return katexPromise;
}

/** Renders TeX via KaTeX. `display` = block-centered; inline otherwise.
 *  throwOnError:false so a typo never blanks the page. */
function MathInner({ tex, display = true, className = "" }) {
  const [html, setHtml] = useState(null);

  useEffect(() => {
    let alive = true;
    loadKatex().then((katex) => {
      if (!alive) return;
      try {
        setHtml(katex.renderToString(tex, { displayMode: display, throwOnError: false }));
      } catch {
        setHtml(null);
      }
    });
    return () => {
      alive = false;
    };
  }, [tex, display]);

  if (html === null) {
    // lightweight fallback while KaTeX loads (or if rendering failed)
    return (
      <code className={`block overflow-x-auto font-mono text-sm text-muted ${className}`}>{tex}</code>
    );
  }
  return (
    <span
      className={`${display ? "block overflow-x-auto py-1 text-center" : "inline"} ${className}`}
      // KaTeX output is static, trusted markup generated from our own TeX strings.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const Math = memo(MathInner);
export default Math;
