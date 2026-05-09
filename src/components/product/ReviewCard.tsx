import type { ProductReview } from "@/types/product";
import StarRating from "@/components/ui/StarRating";

interface ReviewCardProps {
  review: ProductReview;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-border-soft shadow-sm">
      <StarRating rating={review.rating} className="mb-3" />
      <p className="text-charcoal leading-relaxed mb-3 text-sm">
        &ldquo;{review.text}&rdquo;
      </p>
      <p className="text-muted text-xs font-medium">{review.author}</p>
    </div>
  );
}
