/* eslint-disable @next/next/no-img-element */
import { SiteHeader, SiteFooter, PageMotion } from '../new-site';
import { Arrow } from '../ui';

export const metadata = {
  title: 'Maurus Pichler | Pichler Advisory',
  description: 'Maurus Pichler verbindet Erfahrung vom Schweizer Finanzplatz mit direkter Umsetzung: Abläufe verbessern, digitale Lösungen entwickeln und Ihren Betrieb voranbringen.',
};

export default function AboutPage() {
  return <><PageMotion /><SiteHeader /><main id="inhalt">
    <section className="about-hero wrap">
      <div><p className="overline">Maurus Pichler · Gründer</p><h1>Ihr Betrieb<br />hat mehr drauf.<br /><span>Machen wir etwas daraus.</span></h1><p>Sie holen mich dazu, wenn Sie weiterkommen wollen. Ich finde heraus, was Sie ausbremst, und setze die Verbesserung mit Ihnen um.</p><a href="/#anfrage" className="button">Vorhaben besprechen <Arrow /></a></div>
      <figure><img src="/maurus-portrait.jpg" width="1200" height="1600" alt="Maurus Pichler" /><figcaption>Maurus Pichler · Beratung und Umsetzung</figcaption></figure>
    </section>
    <section className="about-position wrap">
      <h2>«Das machen wir<br />schon immer so.»<br />Genau da fange ich an.</h2>
      <div><p>Ein Betrieb kann gut laufen und trotzdem jeden Tag Zeit verlieren. Durch doppelte Eingaben, unnötige Rückfragen oder Arbeit, die nur der Inhaber erledigen kann. Wenn das Alltag wird, fällt es irgendwann kaum noch auf.</p><p>Ich habe Pichler Advisory gegründet, weil ich weiss, wie viel sich daran ändern lässt. Auch kleinere Betriebe sollen Möglichkeiten nutzen, die längst verfügbar sind.</p><p>Was mich antreibt, ist die Umsetzung: wenn ein Ablauf einfacher wird, eine Anwendung Arbeit abnimmt und Sie wieder Zeit für die Führung Ihres Betriebs haben.</p></div>
    </section>
    <section className="about-background"><div className="wrap about-background-grid">
      <div><p className="overline">Geprägt vom Schweizer Finanzplatz</p><h2>Hohe Ansprüche.<br />Klare Umsetzung.</h2></div>
      <div><p>Mein beruflicher Hintergrund liegt am Schweizer Finanzplatz. In diesem anspruchsvollen, schnell getakteten Umfeld müssen Daten stimmen, Übergaben funktionieren und Systeme verlässlich zusammenarbeiten.</p><p>Diesen Blick bringe ich in Ihren Betrieb. Ich verbinde das Verständnis für Geschäftsabläufe mit der Fähigkeit, Apps, Websites und Automatisierungen selbst zu entwickeln. Sie arbeiten direkt mit dem Menschen, der die Lösung umsetzt.</p></div>
    </div></section>
    <section className="about-principles wrap">
      <div className="section-heading"><p className="overline">So arbeite ich</p><h2>Am Ergebnis orientiert.</h2></div>
      <div className="working-steps">
        <article><span className="small-number">01</span><h3>Das Richtige angehen.</h3><p>Wir setzen dort an, wo Aufwand entsteht. Ein einzelner Prozess reicht als Anfang. Ist der Auftrag klar, gehen wir direkt in die Umsetzung.</p></article>
        <article><span className="small-number">02</span><h3>Verantwortung übernehmen.</h3><p>Von der ersten Entscheidung bis zur Einführung arbeite ich direkt mit Ihnen. Umfang, Kosten und der nächste Schritt sind klar.</p></article>
        <article><span className="small-number">03</span><h3>Im Alltag bestehen.</h3><p>Die Verbesserung muss dort funktionieren, wo gearbeitet wird. Wir testen mit Ihrem Team und begleiten die Einführung.</p></article>
      </div>
    </section>
    <section className="closing-section"><div className="wrap closing-row"><h2>Was bremst<br />Ihren Betrieb?</h2><a href="/#anfrage" className="button light">Gehen wir es an <Arrow /></a></div></section>
  </main><SiteFooter /></>;
}
