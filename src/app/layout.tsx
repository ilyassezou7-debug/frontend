import type { Metadata } from "next";
import { Noto_Sans_Arabic, IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import { ConditionalHeader, ConditionalFooter, ConditionalAnnouncementBar } from "@/components/layout/ConditionalLayout";
import PixelProvider from "@/components/tracking/PixelProvider";
import { SITE_CONFIG } from "@/config/site";

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-noto-arabic",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
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
