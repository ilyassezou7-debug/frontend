import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import BestieDuellClient from "./BestieDuellClient";

const nunito = Nunito({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-bd-display", display: "swap" });

export const metadata: Metadata = {
  title: "DAS BESTIE-DUELL – 25 Spiele für beste Freundinnen",
  description:
    "Das Duellbuch für beste Freundinnen: 25 Spiele, 1 gegen 1, ohne Handy und ohne Bildschirm. 120 Seiten, ab 10 Jahren. Erhältlich bei Amazon.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "DAS BESTIE-DUELL – Wer kennt wen wirklich besser?",
    description: "25 Spiele für beste Freundinnen. 1 gegen 1, ohne Bildschirm. Erhältlich bei Amazon.",
    images: ["/images/lp/bestie/cover.webp"],
    locale: "de_DE",
  },
};

export default function BestieDuellPage() {
  return (
    <div className={nunito.variable}>
      <BestieDuellClient />
    </div>
  );
}
