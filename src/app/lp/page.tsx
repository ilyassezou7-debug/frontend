import type { Metadata } from "next";
import LandingPageClient from "./LandingPageClient";

export const metadata: Metadata = {
  title: "أطلس بيور | عناية يومية طبيعية",
  description: "اكتشفي منتجات أطلس بيور الطبيعية لعناية يومية أفضل. توصيل مجاني لكل المغرب، الدفع عند الاستلام، ضمان 30 يوم.",
  robots: { index: false, follow: false },
};

export default function LandingPage() {
  return <LandingPageClient />;
}
