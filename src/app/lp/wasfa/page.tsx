import type { Metadata } from "next";
import WasfaLandingClient from "./WasfaLandingClient";

export const metadata: Metadata = {
  title: "الوصفة اللي هضرت عليها فالفيديو | أطلس بيور",
  description:
    "كبسولات الكركم والجلوكوزامين لدعم المفاصل وتخفيف الألم — تركيبة بإشراف صيادلة. الكمية محدودة. الدفع عند الاستلام وتوصيل مجاني.",
  robots: { index: false, follow: false },
};

export default function WasfaLandingPage() {
  return <WasfaLandingClient />;
}
