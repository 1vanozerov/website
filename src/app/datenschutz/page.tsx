import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { portfolio } from "@/content/portfolio";

export const metadata: Metadata = { title: "Datenschutz" };

export default function DatenschutzPage() {
  return (
    <div className="site-content portfolio-site legal-static" lang="de">
      <SiteHeader />
      <main className="legal-page shell">
        <p className="legal-page__label">Rechtliches / 02</p>
        <h1>Datenschutz<span>.</span></h1>
        <div className="legal-page__body">
          <p className="legal-page__draft">Entwurf: Die Diensteinstellungen und Voraussetzungen für internationale Datenübermittlungen müssen vor der Veröffentlichung geprüft werden.</p>

          <section>
            <h2>1. Verantwortlicher</h2>
            <p>Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:</p>
            <p>Ivan Ozerov<br />Ziolkowskistraße 52<br />14480 Potsdam<br />Deutschland<br />E-Mail: <a href={`mailto:${portfolio.email}`}>{portfolio.email}</a></p>
          </section>

          <section>
            <h2>2. Hosting und Zugriff auf die Website</h2>
            <p>Diese Website wird über GitHub Pages bereitgestellt. Anbieter sind GitHub, Inc., USA, und gegebenenfalls GitHub B.V., Niederlande. Beim Aufruf werden technisch notwendige Daten an GitHub übertragen, insbesondere Ihre IP-Adresse und die angeforderten Dateien. GitHub gibt an, dass die IP-Adresse von Besuchenden von GitHub-Pages-Websites aus Sicherheitsgründen protokolliert und gespeichert wird.</p>
            <p>Die Verarbeitung dient der Bereitstellung und Absicherung der Website. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse besteht im sicheren und zuverlässigen Betrieb der Website. Die Daten können in den USA oder anderen Ländern außerhalb des Europäischen Wirtschaftsraums verarbeitet werden. Informationen zu Speicherdauer und internationalen Übermittlungen finden Sie in den Datenschutzhinweisen von GitHub.</p>
            <p>Weitere Informationen: <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages">GitHub Pages: Datenerhebung</a> und <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">GitHub Privacy Statement</a>.</p>
          </section>

          <section>
            <h2>3. Kontakt per E-Mail und Kontaktformular</h2>
            <p>Wenn Sie mich per E-Mail oder über das Kontaktformular kontaktieren, verarbeite ich die von Ihnen mitgeteilten Daten, insbesondere Ihren Namen, Ihre E-Mail-Adresse und den Inhalt Ihrer Nachricht, um Ihre Anfrage zu bearbeiten und zu beantworten. Die Angabe der Formularfelder ist erforderlich, damit ich Ihre Anfrage über das Formular bearbeiten kann; alternativ können Sie mich per E-Mail kontaktieren.</p>
            <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf einen Vertrag oder vorvertragliche Maßnahmen gerichtet ist. Für sonstige Anfragen ist Art. 6 Abs. 1 lit. f DSGVO die Rechtsgrundlage; mein berechtigtes Interesse liegt in der Bearbeitung und Beantwortung von Anfragen.</p>
            <p>Ich bewahre Anfragen so lange auf, wie dies für ihre Bearbeitung und mögliche Anschlussfragen erforderlich ist. Danach lösche ich sie, sofern keine gesetzlichen Aufbewahrungspflichten oder anderen rechtlichen Gründe eine längere Speicherung erfordern. Die konkrete Aufbewahrung in meinem E-Mail-Postfach ist unabhängig von den Einstellungen bei Web3Forms.</p>
          </section>

          <section>
            <h2>4. Web3Forms</h2>
            <p>Zur technischen Übermittlung der Kontaktformulardaten verwende ich Web3Forms, einen Dienst von Web3Creative in Indien. Wenn Sie das Formular absenden, werden Ihre Eingaben und der hCaptcha-Prüfnachweis an Web3Forms übermittelt. Dabei erhält der Anbieter technisch bedingt auch Verbindungsdaten wie Ihre IP-Adresse. Web3Forms verarbeitet die Angaben zur Bereitstellung des Dienstes und leitet die Nachricht an das konfigurierte E-Mail-Postfach weiter. Der Anbieter nennt unter anderem Amazon Web Services, Cloudflare und Hetzner als Infrastruktur-Dienstleister.</p>
            <p>Die Rechtsgrundlage für die Bearbeitung Ihrer Anfrage richtet sich nach Abschnitt 3. Die Speicherdauer bei Web3Forms hängt vom Tarif und den Kontoeinstellungen ab. Der Anbieter nennt in seiner Datenschutzerklärung grundsätzlich eine Höchstdauer von drei Jahren; laut Preisinformationen kann sie bei bestimmten Tarifen auch länger eingestellt werden.</p>
            <p>Der Anbieter arbeitet von Indien aus und kann Daten in weiteren Ländern außerhalb des Europäischen Wirtschaftsraums verarbeiten. Nach Angaben von Web3Forms ist sein Auftragsverarbeitungsvertrag Bestandteil der Nutzungsbedingungen; für internationale Übermittlungen verweist der Anbieter auf Standardvertragsklauseln. Weitere Informationen: <a href="https://web3forms.com/privacy">Web3Forms Privacy Policy</a> und <a href="https://web3forms.com/terms">Nutzungsbedingungen</a>.</p>
          </section>

          <section>
            <h2>5. Spam-Schutz durch hCaptcha</h2>
            <p>Auf der Kontaktseite wird hCaptcha zum Schutz des Formulars vor automatisierten und missbräuchlichen Anfragen eingebunden. Anbieter ist Intuition Machines, Inc., USA. Bereits beim Aufruf der Kontaktseite lädt Ihr Browser Komponenten des Anbieters und stellt eine Verbindung zu dessen Servern her.</p>
            <p>Dabei können insbesondere die IP-Adresse, technische Informationen über Browser und Gerät, Datum und Uhrzeit sowie Interaktionen mit der Prüfung verarbeitet werden. hCaptcha kann dabei Cookies oder vergleichbare Technologien verwenden. Einzelheiten zur Verarbeitung und Speicherdauer bestimmt der Anbieter in seinen Hinweisen. Die Daten können in den USA oder anderen Ländern außerhalb des Europäischen Wirtschaftsraums verarbeitet werden.</p>
            <p>Die Verarbeitung dient dem Schutz vor Spam und Missbrauch. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO; das berechtigte Interesse liegt im Schutz des Kontaktformulars. hCaptcha verweist für Übermittlungen außerhalb des EWR auf Standardvertragsklauseln in seinem Auftragsverarbeitungsvertrag. Weitere Informationen: <a href="https://www.hcaptcha.com/privacy">hCaptcha Privacy Policy</a> und <a href="https://www.hcaptcha.com/gdpr">hCaptcha und DSGVO</a>.</p>
          </section>

          <section>
            <h2>6. Browser-Speicher und Spiel</h2>
            <p>Die Website selbst setzt nach dem derzeitigen technischen Stand keine Analyse- oder Werbe-Cookies ein. Ihr Browser kann Dateien der Website zwischenspeichern. Davon unberührt bleiben mögliche Speicher- oder Zugriffsvorgänge durch eingebundene Dienste wie hCaptcha, die gesondert zu prüfen sind.</p>
            <p>Auf der Seite Games kann durch Anklicken von „MARS“ das Spiel Freedoom gestartet werden. Die hierfür benötigten Dateien werden vom selben Website-Hosting geladen und im Browser ausgeführt. Über das Spiel ist in der aktuellen Einbindung keine Übermittlung von Spielständen an einen eigenen Spielserver vorgesehen; beim Laden der Dateien gelten die Angaben zum Hosting.</p>
          </section>

          <section>
            <h2>7. Externe Links</h2>
            <p>Diese Website enthält Links zu externen Angeboten, unter anderem zu GitHub und den Datenschutzhinweisen der genannten Anbieter. Erst beim Anklicken verlassen Sie diese Website und rufen das jeweilige Angebot auf. Für die anschließende Verarbeitung gelten die Hinweise des jeweiligen Anbieters.</p>
          </section>

          <section>
            <h2>8. Ihre Rechte</h2>
            <p>Sie haben im Rahmen der gesetzlichen Voraussetzungen das Recht auf Auskunft über Ihre personenbezogenen Daten (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.</p>
            <p>Sie können aus Gründen, die sich aus Ihrer besonderen Situation ergeben, der Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO nach Art. 21 DSGVO widersprechen. Zur Ausübung Ihrer Rechte wenden Sie sich an die oben genannte E-Mail-Adresse.</p>
            <p>Sie haben außerdem das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, insbesondere in dem Mitgliedstaat Ihres gewöhnlichen Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes (Art. 77 DSGVO).</p>
          </section>

          <section>
            <h2>9. Stand und Änderungen</h2>
            <p>Stand: November 2026. Diese Erklärung wird angepasst, wenn sich die verwendeten Dienste oder die tatsächliche Datenverarbeitung ändern.</p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
