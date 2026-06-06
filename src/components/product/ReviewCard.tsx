import type { ProductReview } from "@/types/product";
import StarRating from "@/components/ui/StarRating";
import { Quote } from "lucide-react";

interface ReviewCardProps {
  review: ProductReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="relative group bg-gradient-to-br from-white to-ivory-2 rounded-2xl p-5 border border-border-soft shadow-soft hover:shadow-card hover:-translate-y-0.5 hover:border-saffron/40 transition-all duration-300">
      <Quote
        aria-hidden
        className="absolute top-3 left-3 w-7 h-7 text-saffron/15 group-hover:text-saffron/30 transition-colors"
      />
      <StarRating rating={review.rating} className="mb-3" />
      <p className="text-charcoal leading-relaxed mb-4 text-sm">
        &ldquo;{review.text}&rdquo;
      </p>
      <div className="flex items-center gap-2 pt-3 border-t border-border-soft/70">
        <span className="w-7 h-7 rounded-full bg-gradient-gold text-white text-[11px] font-bold flex items-center justify-center shadow-soft">
          {review.author?.[0] ?? "ز"}
        </span>
        <p className="text-charcoal text-xs font-semibold">{review.author}</p>
        <span className="mr-auto text-[10px] font-bold text-teal/70 uppercase tracking-wider">
          عميل موثّق
        </span>
      </div>
    </div>
  );
}
