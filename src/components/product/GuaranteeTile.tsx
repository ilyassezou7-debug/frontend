import { ShieldCheck, Banknote } from "lucide-react";

/** Fills the empty sixth cell when five products sit in a 2- or 3-column grid; hidden where all five fit one row. */
export default function GuaranteeTile() {
  return (
    <div className="lg:hidden flex flex-col justify-between h-full rounded-2xl sm:rounded-3xl bg-gradient-teal text-ivory p-4 sm:p-6">
      <span className="w-11 h-11 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
        <ShieldCheck className="w-6 h-6" />
      </span>
      <div className="mt-4">
        <p className="font-display font-bold text-lg sm:text-xl leading-snug">جربي بلا مخاطرة</p>
        <p className="text-ivory/75 text-xs sm:text-sm leading-relaxed mt-2">
          كتخلصي غير ملي تشدي الطلبية، وعندك ضمان 30 يوم.
        </p>
      </div>
      <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-saffron-light">
        <Banknote className="w-4 h-4" />
        الدفع عند الاستلام
      </p>
    </div>
  );
}
