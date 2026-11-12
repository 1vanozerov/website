import { portfolio } from "@/content/portfolio";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer shell">
      <span>© {new Date().getFullYear()} {portfolio.name}</span>
      <nav className="site-footer__links" aria-label="Legal information">
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Datenschutz</Link>
      </nav>
    </footer>
  );
}
