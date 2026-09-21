import type { Metadata } from "next";
import KalafLandingClient from "./KalafLandingClient";

export const metadata: Metadata = {
  title: "كريم الكلف | أطلس بيور",
  description:
    "كريم Atlas Pure كيخفف مظهر الكلف والبقع الداكنة — أسيد كوجيك، ألفا أربوتين وفيتامين C. 15 دقيقة، 3 ليالي فالسيمانة. الدفع عند الاستلام وتوصيل مجاني.",
  robots: { index: false, follow: false },
};

export default function KalafLandingPage() {
  return <KalafLandingClient />;
}
