import type { Metadata } from "next";
import MafasilLandingClient from "./MafasilLandingClient";

export const metadata: Metadata = {
  title: "وجع المفاصل والركبة؟ الحل الطبيعي من أطلس بيور",
  description:
    "تركيبة صيدلانية بالجلوكوزامين والكركم لتخفيف ألم المفاصل والركبة والظهر ودعم الغضروف. توصيل مجاني، الدفع عند الاستلام، ضمان 30 يوم.",
  robots: { index: false, follow: false },
};

export default function MafasilLandingPage() {
  return <MafasilLandingClient />;
}
