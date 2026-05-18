import type { Metadata } from "next";
import { Noto_Sans_Arabic, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { ConditionalHeader, ConditionalFooter, ConditionalAnnouncementBar } from "@/components/layout/ConditionalLayout";
import PixelProvider from "@/components/tracking/PixelProvider";
import { SITE_CONFIG } from "@/config/site";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  // Trimmed from 6 weights to 3 — covers body (400), semi-bold (600), bold (700)
  weight: ["400", "600", "700"],
  variable: "--font-noto-arabic",
  display: "swap",
  preload: true,
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  // Display font only needs medium + bold
  weight: ["500", "700"],
  variable: "--font-ibm-arabic",
  display: "swap",
  preload: false,
});

const inter = Inter({
  subsets: ["latin"],
  // Numbers / latin admin UI — regular + medium only
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} | عناية صيدلانية نباتية مغربية`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "أطلس بيور – علامة مغربية للعناية الصيدلانية النباتية. تركيبات من إعداد صيادلة، مصادق عليها (ONSSA)، ضمان 30 يوم، الدفع عند الاستلام، وتوصيل مجاني لجميع مدن المغرب.",
  keywords: [
    "عناية صيدلانية",
    "منتجات نباتية مغربية",
    "ONSSA",
    "صيدلانية",
    "أطلس بيور",
    "AtlasPure",
    "الدفع عند الاستلام",
    "رائحة الفم",
    "رائحة القدمين",
    "فطريات الأظافر",
  ],
  metadataBase: new URL(SITE_CONFIG.siteUrl),
  openGraph: {
    type: "website",
    locale: "ar_MA",
    url: SITE_CONFIG.siteUrl,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description:
      "تركيبات نباتية مدروسة من إعداد صيادلة، مصادق عليها رسمياً. الدفع عند الاستلام، توصيل مجاني، ضمان 30 يوم.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} | ${SITE_CONFIG.tagline}`,
    description:
      "علامة مغربية للعناية الصيدلانية النباتية. تركيبات مدروسة، الدفع عند الاستلام.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${notoSansArabic.variable} ${ibmPlexSansArabic.variable} ${inter.variable}`}
    >
      <head>
        {/* Preconnect to Google Fonts origins so the TLS handshake is done
            before the browser even parses the font CSS — saves ~200 ms on
            first load on average connections. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-arabic">
        <PixelProvider>
          <ConditionalHeader />
          <div className="relative z-40">
            <ConditionalAnnouncementBar />
          </div>
          <main>{children}</main>
          <ConditionalFooter />
        </PixelProvider>
      </body>
    </html>
  );
}
