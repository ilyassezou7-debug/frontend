import { cn } from "@/lib/cn";

interface BrandMarkProps {
  size?: number;
  variant?: "light" | "dark";
  className?: string;
}

/**
 * AtlasPure brand mark.
 * A circular apothecary seal: deep Atlas-green disc with a thin gold ring,
 * featuring a stylized leaf-over-mountain glyph that nods to the Atlas range
 * and botanical care.
 */
export default function BrandMark({
  size = 40,
  variant = "light",
  className,
}: BrandMarkProps) {
  const isDark = variant === "dark";
  const disc = isDark ? "#F7F5EF" : "#0E5C4A";
  const ring = "#B8862F";
  const glyph = isDark ? "#0E5C4A" : "#F7F5EF";
  const accent = "#B8862F";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={cn("flex-shrink-0", className)}
      aria-hidden="true"
    >
      {/* Outer gold ring */}
      <circle cx="32" cy="32" r="31" fill="none" stroke={ring} strokeWidth="1" opacity="0.55" />
      {/* Disc */}
      <circle cx="32" cy="32" r="29" fill={disc} />
      {/* Inner thin ring */}
      <circle cx="32" cy="32" r="26" fill="none" stroke={ring} strokeWidth="0.6" opacity="0.45" />

      {/* Mountain (Atlas) */}
      <path
        d="M14 44 L26 28 L33 36 L42 24 L52 44 Z"
        fill={glyph}
        opacity="0.95"
      />
      {/* Leaf (botanic) sitting above the ridge */}
      <path
        d="M32 14 C36 18, 36 24, 32 28 C28 24, 28 18, 32 14 Z"
        fill={accent}
      />
      {/* Leaf vein */}
      <line
        x1="32"
        y1="15"
        x2="32"
        y2="27"
        stroke={disc}
        strokeWidth="0.6"
        opacity="0.6"
      />
    </svg>
  );
}
