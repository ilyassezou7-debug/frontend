import Image from "next/image";

interface PainPointsListProps {
  title: string;
  intro: string;
  points: string[];
  image?: string;
  imageAlt?: string;
}

/**
 * Pain section — a list of 4 hyper-specific painful moments instead of one
 * vague paragraph. Cold-traffic users immediately recognize themselves.
 * Image fills the full grid column on desktop (no max-w cap).
 */
export default function PainPointsList({
  title,
  intro,
  points,
  image,
  imageAlt,
}: PainPointsListProps) {
  return (
    <section className="section-padding bg-sand">
      <div className="container-max">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-square max-w-md mx-auto md:max-w-none w-full md:order-1 order-2">
            <div className="absolute inset-0 bg-white rounded-3xl shadow-sm transform rotate-1" />
            {image && (
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                className="object-cover rounded-3xl"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
          </div>

          {/* Pain points list */}
          <div className="space-y-5 md:order-2 order-1">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal leading-tight">
              {title}
            </h2>
            <p className="text-muted leading-relaxed text-lg">{intro}</p>

            <ul className="space-y-3 mt-4">
              {points.map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 bg-white rounded-2xl p-4 border border-border-soft shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                    ✕
                  </div>
                  <p className="text-charcoal leading-relaxed text-[15px] flex-1">
                    {point}
                  </p>
                </li>
              ))}
            </ul>

            <p className="text-charcoal font-medium border-r-4 border-teal pr-4 py-2 bg-white/60 rounded-l-lg italic">
              &laquo; لست وحدك... آلاف المغاربة جرّبوا الحل وارتاحوا
              أخيراً. &raquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
