import type { Metadata } from "next";
import "./fonts.css";
import "./globals.css";
import { ConditionalHeader, ConditionalFooter, ConditionalAnnouncementBar } from "@/components/layout/ConditionalLayout";
import PixelProvider from "@/components/tracking/PixelProvider";
import { SITE_CONFIG } from "@/config/site";

// Fonts are self-hosted in public/fonts (see fonts.css): next/font/google downloads at build time, and that
// download failed a deploy on 2026-09-22.

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
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preload" href="/fonts/noto-arabic-0.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
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
