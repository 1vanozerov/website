import type { Metadata } from "next";
import { SceneLink } from "@/components/route-transition";
import { games } from "@/content/games";
import { MarsBackground } from "@/components/mars-background";
import { SiteFooter } from "@/components/site-footer";
import { MarsTitle } from "@/components/mars-title";

const game = games[0];

export const metadata: Metadata = {
  title: "LAST SHIFT: MARS",
  description: "LAST SHIFT: MARS - atmospheric psychological horror currently in development.",
};

export default function GamesPage() {
  return (
    <div className="mars-site" id="top">
      <div className="mars-grain" aria-hidden="true" />
      <div className="mars-dither" aria-hidden="true" />
      <div className="mars-art" aria-hidden="true"><MarsBackground /></div>

      <header className="mars-header">
        <SceneLink href="/" className="mars-back">← About</SceneLink>
      </header>

      <main className="mars-main">
        <section className="mars-title-screen" aria-labelledby="mars-heading">
          <div className="mars-title-screen__copy">
            <MarsTitle />
            <p className="mars-title-screen__description">{game.genre}</p>
            <p className="mars-status">currently in development</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
