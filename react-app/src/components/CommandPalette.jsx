import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search, Home, FolderKanban, User, Mail, Lock, Gamepad2, ArrowUpRight,
  Copy, Check, Instagram, Linkedin, Github, Sparkles,
} from "lucide-react";
import { site, socials, projects } from "../data/site.js";
import { cn } from "../lib/cn.js";

/**
 * Cmd/Ctrl+K command palette — hand-rolled (zero deps), fully keyboard
 * accessible: combobox/listbox ARIA, arrow-key navigation, Enter to run,
 * Esc to close, focus restored on close. Nav's ⌘K button opens it via the
 * "killey:cmdk" custom event.
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);
  const lastFocus = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // open/close wiring -------------------------------------------------------
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("killey:cmdk", onEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("killey:cmdk", onEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      lastFocus.current = document.activeElement;
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.documentElement.style.overflow = "";
      setQuery("");
      setActive(0);
      lastFocus.current?.focus?.();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  function goToSection(id) {
    close();
    const scroll = () => document.getElementById(id)?.scrollIntoView({ block: "start" });
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scroll, 80);
    } else {
      scroll();
    }
  }

  // actions -----------------------------------------------------------------
  const actions = useMemo(() => {
    const a = [
      { group: "Go to", label: "Home — top", icon: Home, keywords: "start hero", run: () => goToSection("main") },
      { group: "Go to", label: "Work", icon: FolderKanban, keywords: "projects games portfolio", run: () => goToSection("work") },
      { group: "Go to", label: "About", icon: User, keywords: "bio hassan who", run: () => goToSection("about") },
      { group: "Go to", label: "Contact", icon: Mail, keywords: "email hire talk", run: () => goToSection("contact") },
      { group: "Go to", label: "Owner cockpit", icon: Lock, keywords: "dashboard admin login private", run: () => { close(); navigate("/owner"); } },
    ];
    for (const p of projects.filter((x) => x.client)) {
      a.push({
        group: "Projects",
        label: `${p.name} — case study`,
        icon: Gamepad2,
        keywords: `${p.type} ${p.status} ${p.slug}`,
        run: () => { close(); navigate(`/work/${p.slug}`); },
      });
      if (p.url) {
        a.push({
          group: "Projects",
          label: `Open ${p.name} live`,
          icon: ArrowUpRight,
          keywords: `play launch ${p.slug}`,
          run: () => { close(); window.open(p.url, "_blank", "noopener"); },
        });
      }
    }
    a.push(
      {
        group: "Connect",
        label: copied ? "Email copied ✓" : `Copy email — ${site.email}`,
        icon: copied ? Check : Copy,
        keywords: "mail clipboard contact",
        keepOpen: true,
        run: () => {
          navigator.clipboard?.writeText(site.email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          });
        },
      },
      { group: "Connect", label: "Instagram — @hssn.shah", icon: Instagram, keywords: "social ig", run: () => { close(); window.open(socials.instagram, "_blank", "noopener"); } },
      { group: "Connect", label: "LinkedIn", icon: Linkedin, keywords: "social work cv", run: () => { close(); window.open(socials.linkedin, "_blank", "noopener"); } },
      { group: "Connect", label: "GitHub — killeyyy", icon: Github, keywords: "code repos", run: () => { close(); window.open(socials.github, "_blank", "noopener"); } },
    );
    return a;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copied, location.pathname]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) => `${a.group} ${a.label} ${a.keywords}`.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    document.getElementById(`cmdk-item-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onInputKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[active]?.run();
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  }

  if (!open) return null;

  let lastGroup = null;
  return (
    <div className="fixed inset-0 z-[110]" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" onMouseDown={close} aria-hidden="true" />
      <div className="border-gradient relative mx-auto mt-[12vh] w-[min(92vw,560px)] overflow-hidden rounded-2xl bg-surface/95 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)]" data-lenis-prevent>
        <div className="flex items-center gap-3 border-b border-line/60 px-4 py-3.5">
          <Search size={16} className="shrink-0 text-gold" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Jump to, play, copy, connect…"
            className="w-full bg-transparent text-sm text-silver outline-none placeholder:text-muted"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmdk-list"
            aria-activedescendant={results.length ? `cmdk-item-${active}` : undefined}
            aria-label="Search commands"
          />
          <kbd className="rounded border border-line/70 px-1.5 py-0.5 font-mono text-[10px] text-muted">esc</kbd>
        </div>

        <ul id="cmdk-list" role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted">Nothing matches "{query}".</li>
          )}
          {results.map((a, i) => {
            const header = a.group !== lastGroup ? a.group : null;
            lastGroup = a.group;
            const ItemIcon = a.icon || Sparkles;
            return (
              <li key={`${a.group}-${a.label}`}>
                {header && (
                  <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted" aria-hidden="true">
                    {header}
                  </p>
                )}
                <button
                  id={`cmdk-item-${i}`}
                  role="option"
                  aria-selected={i === active}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => a.run()}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                    i === active ? "bg-crimson/15 text-crimson-bright" : "text-silver",
                  )}
                >
                  <ItemIcon size={15} className={i === active ? "text-crimson-bright" : "text-muted"} aria-hidden="true" />
                  <span className="flex-1">{a.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between border-t border-line/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-wider text-muted">
          <span>↑↓ navigate · ↵ select</span>
          <span className="text-gold">{site.brand}</span>
        </div>
      </div>
    </div>
  );
}
