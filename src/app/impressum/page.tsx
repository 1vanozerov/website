import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { portfolio } from "@/content/portfolio";

export const metadata: Metadata = { title: "Impressum" };

export default function ImpressumPage() {
  return (
    <div className="site-content portfolio-site legal-static" lang="de">
      <SiteHeader />
      <main className="legal-page shell">
        <p className="legal-page__label">Rechtliches / 01</p>
        <h1>Impressum<span>.</span></h1>
        <div className="legal-page__body">
          <section><h2>Angaben gemäß § 5 DDG</h2><p>Ivan Ozerov<br />Ziolkowskistraße 52<br />14480 Potsdam<br />Deutschland</p></section>
          <section><h2>Kontakt</h2><p>E-Mail: <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a><br />Weitere Kontaktmöglichkeit: <a href={`${process.env.NEXT_PUBLIC_ASSET_BASE_PATH || ""}/contact/#contact-form`}>Kontaktformular</a></p></section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
