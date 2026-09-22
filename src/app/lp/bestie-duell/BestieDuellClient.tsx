"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect } from "react";
import { generateEventId } from "@/lib/event-id";
import { saveLandingUrl } from "@/lib/tracking";

/**
 * Bridge page for the German KDP book DAS BESTIE-DUELL: persuades, fires pixel events, then sends the visitor to Amazon.de.
 * The Meta pixel never runs on Amazon - InitiateCheckout on the outbound click is the conversion the Sales campaign optimises for.
 * Only real facts: real page renders from the print PDF, real specs from the Amazon listing, no invented reviews or numbers.
 */
const ASIN = "B0HGTZ5PN3";
const PRICE = 9.99;
/** Swap in the Amazon Attribution link (Amazon Ads -> Attribution) once it exists, to see which clicks became sales. */
const AMAZON_URL = `https://www.amazon.de/dp/${ASIN}`;
const IMG = (n: string) => `/images/lp/bestie/${n}.webp`;

type Fbq = (...args: unknown[]) => void;
type Ttq = { track: (...args: unknown[]) => void };

function track(event: "ViewContent" | "InitiateCheckout") {
  if (typeof window === "undefined") return;
  const params = { value: PRICE, currency: "EUR", content_ids: [ASIN], content_type: "product", content_name: "DAS BESTIE-DUELL" };
  const eventID = generateEventId();
  const w = window as unknown as { fbq?: Fbq; ttq?: Ttq };
  try { w.fbq?.("track", event, params, { eventID }); } catch { /* pixel blocked */ }
  try { w.ttq?.track(event, { value: PRICE, currency: "EUR", content_id: ASIN }, { event_id: eventID }); } catch { /* pixel blocked */ }
}

function AmazonButton({ label = "Jetzt bei Amazon ansehen", big = false }: { label?: string; big?: boolean }) {
  const go = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    track("InitiateCheckout");
    setTimeout(() => { window.location.href = AMAZON_URL; }, 280);   // give the pixel a moment to send
  };
  return (
    <a
      href={AMAZON_URL}
      onClick={go}
      rel="noopener"
      className={`bd-cta flex w-full max-w-[460px] whitespace-nowrap items-center justify-center gap-3 rounded-full bg-[#E8356D] hover:bg-[#D12A60] text-white font-[family-name:var(--font-bd-display)] font-extrabold shadow-[0_10px_24px_rgba(232,53,109,0.35)] transition-colors focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#2A1B3D] ${
        big ? "text-xl px-6 py-5" : "text-[17px] px-5 py-4"
      }`}
    >
      {label}
      <span className="rounded-full bg-white/20 px-3 py-1 text-base">{PRICE.toFixed(2).replace(".", ",")} €</span>
    </a>
  );
}


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

const SECTION = (n: string) => `/images/lp/bestie/s_${n}.webp`;
const SIZES: Record<string, [number, number]> = {
  "01_hero": [1080, 1920], "02_stats": [1080, 1620], "03_how": [1080, 1620], "04_inside": [1080, 1620],
  "05_moments": [1080, 1920], "06_trust": [1080, 1620], "07_final": [1080, 1620],
};

function goAmazon(e?: React.MouseEvent) {
  e?.preventDefault();
  track("InitiateCheckout");
  setTimeout(() => { window.location.href = AMAZON_URL; }, 280);   // give the pixel a moment to send
}

/** A designed section image (German text written in by gpt-image-2). Sections with a drawn button open Amazon on tap. */
function Section({ n, alt, cta = false, eager = false }: { n: string; alt: string; cta?: boolean; eager?: boolean }) {
  const [w, h] = SIZES[n];
  const img = <img src={SECTION(n)} alt={alt} width={w} height={h} loading={eager ? "eager" : "lazy"}
                   fetchPriority={eager ? "high" : undefined} className="block w-full h-auto" />;
  return cta ? <a href={AMAZON_URL} onClick={goAmazon} aria-label={alt} className="block">{img}</a> : img;
}

export default function BestieDuellClient() {
  useEffect(() => {
    saveLandingUrl();
    track("ViewContent");
  }, []);

  const display = "font-[family-name:var(--font-bd-display)]";
  return (
    <div lang="de" dir="ltr" className="min-h-screen bg-[#F4ECF2] text-[#2A1B3D] font-sans antialiased">
      <style>{`
        @keyframes bdPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.025); } }
        .bd-cta { animation: bdPulse 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .bd-cta { animation: none; } }
      `}</style>
      <main className="max-w-[540px] mx-auto bg-[#FFFBFD] shadow-[0_0_60px_rgba(42,27,61,0.10)]">
        <Section n="01_hero" alt="DAS BESTIE-DUELL – Wer kennt wen wirklich besser? Jetzt bei Amazon ansehen, 9,99 €" cta eager />
        <Section n="02_stats" alt="Handys weg. Duell an. 25 Spiele, 120 Seiten, 2 Spielerinnen, 0 Bildschirme" />
        <Section n="03_how" alt="So funktioniert's: gegenübersetzen, Buch drehen, gleichzeitig spielen" />

        {/* ── real pages from the print PDF ── */}
        <section className="px-5 py-10 bg-[#F7F1FA]">
          <p className="text-xs font-bold tracking-widest uppercase text-[#19A7A5] text-center">Blick ins Buch</p>
          <h2 className={`${display} font-black text-3xl text-center mt-1`}>Echte Seiten, genau so gedruckt.</h2>
          <figure className="mt-6 bg-white rounded-2xl p-2 border border-[#EDE0F1]">
            <div className="grid grid-cols-2 gap-1.5">
              <img src={IMG("p010")} alt="Echte Buchseite: Spielfeld der ersten Spielerin" width={1320} height={960} loading="lazy" className="w-full h-auto rounded-md" />
              <img src={IMG("p011")} alt="Echte Buchseite: Spielfeld der zweiten Spielerin" width={1320} height={960} loading="lazy" className="w-full h-auto rounded-md" />
            </div>
            <figcaption className="text-center text-xs text-[#7A6A86] pt-2 pb-1">Echte Doppelseite – Spiel 1 „Armband-Muster“, jede hat ihre Seite</figcaption>
          </figure>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {PAGES.map((p) => (
              <figure key={p.n} className="bg-white rounded-xl overflow-hidden border border-[#EDE0F1]">
                <img src={IMG(p.n)} alt={p.t} width={1320} height={960} loading="lazy" className="w-full h-auto border-b border-[#EDE0F1]" />
                <figcaption className="p-3"><p className={`${display} font-extrabold text-sm leading-tight`}>{p.t}</p><p className="text-xs text-[#4B3A5C] mt-1 leading-snug">{p.d}</p></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <Section n="04_inside" alt="Was drin ist: 25 Spiele, gelöste Beispiele, geprüfte Lösungen, Punktepläne, Wette, Fotoseite" />
        <div className="px-5 pb-10 flex justify-center"><AmazonButton /></div>
        <Section n="05_moments" alt="Für jeden besonderen Moment: Geburtstag, Übernachtungsparty, Ferien und Autofahrten, Nachmittage ohne Handy" />
        <Section n="06_trust" alt="Sicher bestellen über Amazon – Produktdetails: Ilyass Zouhri, Taschenbuch 21 × 15 cm, 120 Seiten, ab 10 Jahren, ISBN 979-8170276127" />
        <div className="px-5 py-8 bg-[#2A1B3D] flex justify-center"><AmazonButton label="Zum Buch auf Amazon" /></div>

        {/* ── FAQ ── */}
        <section className="px-5 py-10">
          <h2 className={`${display} font-black text-3xl text-center`}>Häufige Fragen</h2>
          <div className="mt-6 space-y-3">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group rounded-2xl border border-[#EDE0F1] bg-white px-4">
                <summary className="cursor-pointer list-none py-4 flex justify-between items-center gap-4 font-bold">
                  {q}<span className="text-[#E8356D] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-4 text-[#4B3A5C] leading-relaxed text-sm">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <Section n="07_final" alt="Handys weg. Duell an. Jetzt bei Amazon ansehen, 9,99 €" cta />
        <footer className="px-5 py-6 text-center text-xs text-[#7A6A86] border-t border-[#F2E4EC]">
          © {new Date().getFullYear()} Ilyass Zouhri · DAS BESTIE-DUELL<br />Amazon und das Amazon-Logo sind Marken von Amazon.com, Inc. oder verbundenen Unternehmen.
        </footer>
      </main>

      {/* ── sticky CTA ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-[#F2E4EC] px-4 pt-3" style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))" }}>
        <a href={AMAZON_URL} onClick={goAmazon}
           className={`${display} bd-cta flex items-center justify-center gap-3 max-w-[508px] mx-auto rounded-full bg-[#E8356D] text-white font-extrabold text-lg py-3.5`}>
          Jetzt bei Amazon ansehen · {PRICE.toFixed(2).replace(".", ",")} €
        </a>
      </div>
      <div className="h-20" />
    </div>
  );
}
