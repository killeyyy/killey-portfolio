import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const getInitial = () =>
  typeof document !== "undefined" && document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";

/** Light/dark theme toggle — persists to localStorage; tokens do the rest. */
export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") root.setAttribute("data-theme", "light");
    else root.removeAttribute("data-theme");
    try {
      localStorage.setItem("killey:theme", theme);
    } catch {
      /* private mode — ignore */
    }
  }, [theme]);

  const nextLabel = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
      aria-label={`Switch to ${nextLabel} theme`}
      title={`Switch to ${nextLabel} theme`}
      className={`inline-flex items-center justify-center rounded-md border border-line/70 p-1.5 text-muted transition-colors hover:border-gold/50 hover:text-gold ${className}`}
    >
      {theme === "light" ? <Moon size={15} aria-hidden="true" /> : <Sun size={15} aria-hidden="true" />}
    </button>
  );
}
