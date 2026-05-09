import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

interface StarRatingProps {
  rating: number;
  max?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function StarRating({
  rating,
  max = 5,
  className,
  size = "md",
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < Math.floor(rating)
              ? "fill-saffron text-saffron"
              : i < rating
              ? "fill-saffron/50 text-saffron"
              : "fill-none text-muted/30"
          )}
        />
      ))}
    </div>
  );
}
