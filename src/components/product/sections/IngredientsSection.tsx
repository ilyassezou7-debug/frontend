import Image from "next/image";
import { Leaf, FlaskConical, BadgeCheck, Award } from "lucide-react";
import type { IngredientDetail } from "@/types/product";

interface IngredientsSectionProps {
  intro: string;
  ingredients: IngredientDetail[];
  image?: string;
  imageAlt?: string;
}

const ICONS = [Leaf, FlaskConical, Award, BadgeCheck] as const;

/**
 * Ingredients deep-dive. Each ingredient is a card with name + benefit + origin.
 * Cold-traffic users get real "why this works" content, not just a list of names.
 * Image fills the column on desktop.
 */
export default function IngredientsSection({
  intro,
  ingredients,
  image,
  imageAlt,
}: IngredientsSectionProps) {
  return (
    <section className="section-padding bg-mist/40">
      <div className="container-max">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="divider-gold mb-4 max-w-xs mx-auto">
            <span>المختبر النباتي</span>
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-charcoal leading-tight mb-3">
            مكونات نشطة –{" "}
            <span className="text-teal">مدروسة، مش عشوائية.</span>
          </h2>
          <p className="text-muted leading-relaxed">{intro}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          {/* Image — proportional on desktop */}
          <div className="relative aspect-square max-w-sm mx-auto lg:max-w-none w-full lg:col-span-2 lg:sticky lg:top-32">
            <div className="absolute inset-0 bg-white rounded-3xl shadow-sm border border-border-soft overflow-hidden" />
            {image && (
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                className="object-cover rounded-3xl"
                sizes="(max-width: 1024px) 100vw, 30vw"
              />
            )}
          </div>

          {/* Ingredient cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-3">
            {ingredients.map((ing, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div
                  key={ing.name}
                  className="bg-white rounded-2xl p-5 border border-border-soft hover:border-teal/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal/10 text-teal flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-charcoal text-base leading-tight">
                        {ing.name}
                      </h3>
                      {ing.origin && (
                        <p className="text-[11px] text-saffron font-semibold mt-0.5">
                          {ing.origin}
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {ing.benefit}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
