import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { InterfaceMotion } from "@/components/interface-motion";
import { EmailDisplay } from "@/components/email-display";
import { portfolio } from "@/content/portfolio";
import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Ivan Ozerov.",
};

export default function ContactPage() {
  return (
    <div className="site-content portfolio-site" id="top">
      <InterfaceMotion />
      <SiteHeader active="contact" />
      <main>
        <section id="contact-form" className="contact-form-section shell" aria-label="Contact form" data-scene-view="7">
          <ContactForm />
        </section>
        <section
          id="contact-email"
          className="email-section email-section--contact shell"
          aria-label="Email address"
          data-scene-view="7"
        >
          <EmailDisplay email={portfolio.email} />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
