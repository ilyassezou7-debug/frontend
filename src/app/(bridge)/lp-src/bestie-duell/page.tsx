/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

/**
 * TEMPLATE for the German bridge page DAS BESTIE-DUELL. Visitors never see this route (/lp-src/bestie-duell):
 * `node tools/export-bridge.mjs` renders it and writes public/lp/bestie-duell.html without any Next.js framework
 * scripts, and next.config.mjs serves that static file at /lp/bestie-duell. After editing this file:
 * npm run build && npm run start, then node tools/export-bridge.mjs, then commit public/lp/bestie-duell.html.
 * Tracking: PageView (layout), ViewContent (script below), InitiateCheckout on every a[data-amz] click (layout).
 * Only real facts: real page renders from the print PDF, real specs from the Amazon listing, no invented reviews.
 */
const ASIN = "B0HGTZ5PN3";
const PRICE = 9.99;
const PRICE_DE = "9,99 €";
/** Swap in the Amazon Attribution link (Amazon Ads -> Attribution) to see which clicks became sales. */
/** Canonical product URL (with the title slug): the bare /dp/ link is more often swallowed by the Amazon app,
 *  which then opens its homepage instead of the book. */
const AMAZON_URL = `https://www.amazon.de/DAS-BESTIE-DUELL-Freundinnen-Bildschirm-Geschenk/dp/${ASIN}`;
const PRODUCT = { value: PRICE, currency: "EUR", content_ids: [ASIN], content_type: "product", content_name: "DAS BESTIE-DUELL" };

export const metadata: Metadata = {
  title: "DAS BESTIE-DUELL – 25 Spiele für beste Freundinnen",
  description:
    "Das Duellbuch für beste Freundinnen: 25 Spiele, 1 gegen 1, ohne Handy und ohne Bildschirm. 120 Seiten, ab 10 Jahren. Erhältlich bei Amazon.",
  openGraph: {
    title: "DAS BESTIE-DUELL – Wer kennt wen wirklich besser?",
    description: "25 Spiele für beste Freundinnen. 1 gegen 1, ohne Bildschirm. Erhältlich bei Amazon.",
    images: ["/images/lp/bestie/s_01_hero-1080.webp"],
    locale: "de_DE",
  },
};

const SIZES: Record<string, [number, number]> = {
  "01_hero": [1080, 1920], "02_stats": [1080, 1620], "03_how": [1080, 1620], "04_inside": [1080, 1620],
  "05_moments": [1080, 1920], "06_trust": [1080, 1620], "07_final": [1080, 1620],
};
const PAGES = [
  { n: "p008", t: "Klare Regeln", d: "Jedes Spiel startet mit Material, Ziel und Punkten – in einer Minute erklärt." },
  { n: "p009", t: "Gelöstes Beispiel", d: "Zu jedem Spiel ein Beispiel, damit niemand raten muss." },
  { n: "p021", t: "25 verschiedene Spiele", d: "Rätsel, Zahlen, Wörter, Zeichnen, Gedächtnis – keins wie das andere." },
  { n: "p110", t: "Alle Lösungen geprüft", d: "Hinten im Buch – für faire Duelle ohne Diskussion." },
  { n: "p119", t: "Ein Platz für euer Foto", d: "Das Buch wird zur Erinnerung an eure Freundschaft." },
  { n: "p022", t: "Jede hat ihre Seite", d: "Beide spielen gleichzeitig – keine wartet, keine schaut zu." },
];
const FAQ = [
  ["Ab welchem Alter ist das Buch?", "Für beste Freundinnen ab etwa 10 Jahren. Die Regeln sind kurz und jedes Spiel hat ein gelöstes Beispiel."],
  ["Was braucht man zum Spielen?", "Nur das Buch und zwei Stifte. Kein Akku, kein Bildschirm, kein Aufbau."],
  ["Kann man öfter als einmal spielen?", "Ja. Hinten im Buch gibt es leere Punktepläne für mehrere Runden – eine Revanche ist also eingeplant."],
  ["Wie funktioniert das mit den zwei Seiten?", "Ihr setzt euch gegenüber und legt das Buch quer zwischen euch. Jede hat ihre eigene Seite aufrecht vor sich – so spielt ihr gleichzeitig."],
  ["Wie läuft Bestellung und Versand?", "Du bestellst direkt bei Amazon. Zahlung, Versand und Rückgabe laufen komplett über Amazon – mit dem gewohnten Käuferschutz."],
];

/** Bump when a section image is regenerated: /images/* is cached for 30 days, so the URL has to change. */
const V = "2";

/** Responsive AVIF/WebP. The first-screen image stays WebP: AVIF decodes much slower on budget phones. */
function Pic({ base, widths, sizes, w, h, alt, eager = false }: {
  base: string; widths: number[]; sizes: string; w: number; h: number; alt: string; eager?: boolean;
}) {
  const set = (ext: string) => widths.map((x) => `${base}-${x}.${ext}?v=${V} ${x}w`).join(", ");
  return (
    <picture>
      {!eager && <source type="image/avif" srcSet={set("avif")} sizes={sizes} />}
      <img src={`${base}-${widths[widths.length - 1]}.webp?v=${V}`} srcSet={set("webp")} sizes={sizes} alt={alt} width={w} height={h}
           loading={eager ? "eager" : "lazy"} decoding="async" fetchPriority={eager ? "high" : "low"} />
    </picture>
  );
}

/** A designed section image (German text written in by gpt-image-2). Sections with a drawn button open Amazon. */
function Section({ n, alt, cta = false, eager = false }: { n: string; alt: string; cta?: boolean; eager?: boolean }) {
  const [w, h] = SIZES[n];
  const img = <Pic base={`/images/lp/bestie/s_${n}`} widths={[480, 640, 750, 828, 1080]} sizes="(max-width: 540px) 100vw, 540px" w={w} h={h} alt={alt} eager={eager} />;
  return cta ? <a href={AMAZON_URL} data-amz="" rel="noopener noreferrer" aria-label={alt} className="blk">{img}</a> : img;
}

const Page = (n: string, alt: string) => (
  <Pic base={`/images/lp/bestie/${n}`} widths={[400, 560, 700]} sizes="(max-width: 540px) 50vw, 270px" w={1320} h={960} alt={alt} />
);

function AmazonButton({ label = "Jetzt bei Amazon kaufen" }: { label?: string }) {
  return (
    <a href={AMAZON_URL} data-amz="" rel="noopener noreferrer" className="btn pulse">
      {label}<i>{PRICE_DE}</i>
    </a>
  );
}

export default function BestieDuellPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{
        __html: `window.__product=${JSON.stringify(PRODUCT)};try{__send('ViewContent',window.__product,__eid())}catch(e){}`,
      }} />
      <main className="wrap">
        <Section n="01_hero" alt="DAS BESTIE-DUELL – Wer kennt wen wirklich besser? Jetzt bei Amazon kaufen, 9,99 €" cta eager />
        <Section n="02_stats" alt="Handys weg. Duell an. 25 Spiele, 120 Seiten, 2 Spielerinnen, 0 Bildschirme" />
        <Section n="03_how" alt="So funktioniert's: gegenübersetzen, Buch drehen, gleichzeitig spielen" />

        {/* real pages from the print PDF */}
        <section className="pages">
          <p className="eyebrow">Blick ins Buch</p>
          <h2 className="h2">Echte Seiten, genau so gedruckt.</h2>
          <figure className="spread">
            <div className="g2">
              {Page("p010", "Echte Buchseite: Spielfeld der ersten Spielerin")}
              {Page("p011", "Echte Buchseite: Spielfeld der zweiten Spielerin")}
            </div>
            <figcaption className="cap">Echte Doppelseite – Spiel 1 „Armband-Muster“, jede hat ihre Seite</figcaption>
          </figure>
          <div className="cards">
            {PAGES.map((p) => (
              <figure key={p.n} className="card">
                {Page(p.n, p.t)}
                <figcaption><b>{p.t}</b><span>{p.d}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <Section n="04_inside" alt="Was drin ist: 25 Spiele, gelöste Beispiele, geprüfte Lösungen, Punktepläne, Wette, Fotoseite" />
        <div className="row"><AmazonButton /></div>
        <Section n="05_moments" alt="Für jeden besonderen Moment: Geburtstag, Übernachtungsparty, Ferien und Autofahrten, Nachmittage ohne Handy" />
        <Section n="06_trust" alt="Sicher bestellen über Amazon – Produktdetails: Ilyass Zouhri, Taschenbuch 21 × 15 cm, 120 Seiten, ab 10 Jahren, ISBN 979-8170276127" />
        <div className="row dark"><AmazonButton label="Buch jetzt kaufen" /></div>

        <section className="faq">
          <h2 className="h2">Häufige Fragen</h2>
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>{q}<span aria-hidden="true">+</span></summary>
              <p>{a}</p>
            </details>
          ))}
        </section>

        <Section n="07_final" alt="Handys weg. Duell an. Jetzt bei Amazon kaufen, 9,99 €" cta />
        <footer className="foot">
          © {new Date().getFullYear()} Ilyass Zouhri · DAS BESTIE-DUELL<br />Amazon und das Amazon-Logo sind Marken von Amazon.com, Inc. oder verbundenen Unternehmen.
        </footer>
      </main>

      <div className="sticky">
        <a href={AMAZON_URL} data-amz="" rel="noopener noreferrer" className="btn pulse nu">Jetzt bei Amazon kaufen · {PRICE_DE}</a>
      </div>
      <div className="spacer" />
    </>
  );
}
