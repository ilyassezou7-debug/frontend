import { Star, BadgeCheck, MapPin } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import type { ProductReview } from "@/types/product";

interface ReviewsBlockProps {
  reviews: ProductReview[];
  rating?: number; // average rating (default 4.8)
  ratingCount: number;
}

const PALETTE = [
  "bg-teal/15 text-teal",
  "bg-saffron/15 text-saffron",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-indigo-100 text-indigo-700",
  "bg-amber-100 text-amber-700",
];

function initialOf(name: string) {
  return name.trim().charAt(0);
}

/**
 * Reviews block — built for cold-traffic conversion:
 * - Big summary header (avg rating + count)
 * - Distribution bars (5★ / 4★ / 3★ ...)
 * - Verified badge + city + age on each card
 * - Larger grid (up to 6 reviews visible)
 */
export default function ReviewsBlock({
  reviews,
  rating = 4.8,
  ratingCount,
}: ReviewsBlockProps) {
  // Compute distribution from reviews + scale to ratingCount for realistic feel
  const counts = [0, 0, 0, 0, 0]; // index 0 = 1★, index 4 = 5★
  reviews.forEach((r) => {
    const idx = Math.max(0, Math.min(4, r.rating - 1));
    counts[idx] += 1;
  });
  const total = counts.reduce((a, b) => a + b, 0) || 1;
  const distribution = counts.map((c) => Math.round((c / total) * 100));

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-10">
          <p className="divider-gold mb-4 max-w-xs mx-auto">
            <span>عملاؤنا يتحدّثون</span>
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal mb-3">
مغاربة اختاروا الفرق
          </h2>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Average rating */}
          <div className="bg-ivory rounded-2xl p-6 border border-border-soft text-center flex flex-col items-center justify-center">
            <p className="text-5xl font-extrabold text-charcoal tabular-nums leading-none mb-2">
              {rating.toFixed(1)}
            </p>
            <StarRating rating={rating} className="mb-2" />
            <p className="text-sm text-muted">
              من <span className="font-bold text-charcoal tabular-nums">{ratingCount}+</span>{" "}
              تقييم موثّق
            </p>
          </div>

          {/* Distribution */}
          <div className="bg-ivory rounded-2xl p-6 border border-border-soft lg:col-span-2">
            <h3 className="text-sm font-bold text-charcoal mb-4">
              توزيع التقييمات
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const pct = distribution[star - 1];
                return (
                  <div
                    key={star}
                    className="flex items-center gap-3 text-xs"
                  >
                    <div className="flex items-center gap-1 w-12 flex-shrink-0">
                      <span className="font-semibold text-charcoal tabular-nums">
                        {star}
                      </span>
                      <Star className="w-3 h-3 fill-saffron text-saffron" />
                    </div>
                    <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-border-soft">
                      <div
                        className="h-full bg-gradient-to-l from-saffron to-saffron-dark rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-muted tabular-nums w-10 text-left">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reviews.map((review, i) => {
            const palette = PALETTE[i % PALETTE.length];
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-border-soft shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={review.rating} size="sm" />
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <BadgeCheck className="w-3 h-3" />
                      شراء موثّق
                    </span>
                  )}
                </div>

                <p className="text-charcoal leading-relaxed text-sm mb-4 flex-1">
                  &laquo; {review.text} &raquo;
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-border-soft">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${palette}`}
                  >
                    {initialOf(review.author)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-charcoal text-xs truncate">
                      {review.author}
                      {review.age && (
                        <span className="text-muted font-normal">
                          {" "}
                          • {review.age} سنة
                        </span>
                      )}
                    </p>
                    {review.city && (
                      <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {review.city}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
