import { site, socials } from "../data/site.js";
import { Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <p className="font-serif text-sm text-muted">
          <span className="text-silver">{site.brand}</span> · © {year} {site.fullName}
        </p>
        <div className="flex items-center gap-4">
          <a href={socials.instagram} target="_blank" rel="noreferrer noopener" aria-label="Instagram" className="text-muted transition-colors hover:text-silver">
            <Instagram size={18} aria-hidden="true" />
          </a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="text-muted transition-colors hover:text-silver">
            <Linkedin size={18} aria-hidden="true" />
          </a>
          <a href={socials.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="text-muted transition-colors hover:text-silver">
            <Github size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
