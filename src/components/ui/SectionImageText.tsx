import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

interface SectionImageTextProps {
  imageSlot: ReactNode;
  textSlot: ReactNode;
  reverse?: boolean;
  className?: string;
}

export default function SectionImageText({
  imageSlot,
  textSlot,
  reverse = false,
  className,
}: SectionImageTextProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center",
        className
      )}
    >
      <div className={cn(reverse ? "md:order-2" : "md:order-1")}>
        {imageSlot}
      </div>
      <div className={cn(reverse ? "md:order-1" : "md:order-2")}>
        {textSlot}
      </div>
    </div>
  );
}
