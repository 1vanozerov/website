import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InterfaceMotion } from "@/components/interface-motion";
import { ParticleIntro, ParticleText } from "@/components/particle-intro";
import { EmailDisplay } from "@/components/email-display";
import { ProjectCarousel } from "@/components/project-carousel";
import { portfolio } from "@/content/portfolio";

export const metadata: Metadata = {
  title: "About",
  description:
    "Ivan Ozerov - independent developer in Germany. Flutter and Swift mobile apps, MVPs and websites.",
};

export default function AboutPage() {
  return (
    <div className="site-content portfolio-site" id="top">
      <InterfaceMotion />
      <SiteHeader active="about" />

      <main>
        <section
          className="intro-hero shell"
          data-scene-view="1"
          aria-labelledby="intro-title"
        >
          <div className="intro-hero__main">
            <ParticleIntro />
          </div>

          <a className="intro-scroll" href="#about" aria-label="Scroll to About" data-reveal="meta">
            <span aria-hidden="true">↓</span>
          </a>
        </section>

        <div className="editorial">
          <section
            className="about-summary shell"
            id="about"
            data-scene-view="2"
            aria-labelledby="about-summary-title"
          >
            <div className="section-label" data-reveal="heading" data-signal="section">
              <h2 id="about-summary-title"><ParticleText text="About" /></h2>
            </div>
            <div className="about-summary__copy" data-reveal="copy">
              <p><ParticleText text={portfolio.intro} highlightGermany /></p>
              <p><ParticleText text={portfolio.about} /></p>
            </div>
          </section>

          <section
            className="expertise shell"
            id="services"
            data-scene-view="3"
            aria-labelledby="expertise-title"
          >
            <div className="section-label" data-reveal="heading" data-signal="section">
              <h2 id="expertise-title"><ParticleText text="What I do" /></h2>
            </div>
            <div className="expertise__list">
              {portfolio.services.map((service) => (
                <article className="expertise-row" key={service.id} data-reveal="row" data-signal="section">
                  <div><h3><ParticleText text={service.name} /></h3><p><ParticleText text={service.description} /></p></div>
                </article>
              ))}
            </div>
          </section>

          <section
            className="selected-work"
            id="work"
            data-scene-view="4"
            aria-labelledby="work-title"
          >
            <ProjectCarousel projects={portfolio.projects} />
          </section>

          <section className="email-section email-section--with-form-link shell" id="contact" aria-label="Email address" data-scene-view="4">
            <EmailDisplay email={portfolio.email} particle />
            <a className="contact-form-link" href={`${process.env.NEXT_PUBLIC_ASSET_BASE_PATH || ""}/contact/#contact-form`}>Or send a message <span aria-hidden="true">↗</span></a>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
