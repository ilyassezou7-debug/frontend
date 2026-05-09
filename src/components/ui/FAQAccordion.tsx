"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export default function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <Accordion.Root
      type="multiple"
      className={cn("space-y-3", className)}
    >
      {items.map((item, i) => (
        <Accordion.Item
          key={i}
          value={`item-${i}`}
          className="bg-white border border-border-soft rounded-2xl overflow-hidden"
        >
          <Accordion.Header>
            <Accordion.Trigger className="w-full flex items-center justify-between px-5 py-4 text-right font-semibold text-charcoal hover:text-teal transition-colors group [&[data-state=open]>svg]:rotate-180">
              <span>{item.q}</span>
              <ChevronDown className="w-5 h-5 text-muted flex-shrink-0 transition-transform duration-200 me-auto ms-3" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
            <div className="px-5 pb-4 text-muted leading-relaxed text-sm border-t border-border-soft pt-3">
              {item.a}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
