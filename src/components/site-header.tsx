import { ParticleText } from "@/components/particle-intro";
import { SceneLink } from "@/components/route-transition";
import { portfolio } from "@/content/portfolio";

export function SiteHeader({ active }: { active?: "about" | "contact" }) {
  return (
    <header className="site-header shell" data-reveal={active === "about" ? "meta" : undefined}>
      <SceneLink className="brand" href="/">{active === "about" ? <ParticleText text={portfolio.name} /> : portfolio.name}</SceneLink>
      <nav className="nav" aria-label="Main navigation">
        <SceneLink href="/" aria-current={active === "about" ? "page" : undefined}>{active === "about" ? <ParticleText text="About" /> : "About"}</SceneLink>
        <SceneLink href="/games">{active === "about" ? <ParticleText text="Games" /> : "Games"}</SceneLink>
        <SceneLink href="/contact" aria-current={active === "contact" ? "page" : undefined}>{active === "about" ? <ParticleText text="Contact" /> : "Contact"}</SceneLink>
      </nav>
    </header>
  );
}
