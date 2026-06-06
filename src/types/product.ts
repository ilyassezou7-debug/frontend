export type ProductId =
  | "breath_drops"
  | "foot_spray"
  | "nail_serum"
  | "hair_serum"
  | "joint_capsules";
export type OfferId = "one" | "two" | "three" | "upsell_99";

export interface ProductOffer {
  offerId: "one" | "two" | "three";
  quantity: 1 | 2 | 3;
  price: number;
  label: string;
  badge?: string;
}

export interface ProductReview {
  text: string;
  author: string;
  rating: number;
  city?: string;
  age?: number;
  verified?: boolean;
}

export interface IngredientDetail {
  name: string;
  benefit: string;
  origin?: string;
}

export interface ComparisonRow {
  feature: string;
  us: boolean | string;
  traditional: boolean | string;
  pharmacy: boolean | string;
}

export interface Benefit {
  title: string;
  desc: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface Product {
  id: ProductId;
  slug: string;
  name: string;
  displayName: string;
  shortName: string;
  headline: string;
  subheading: string;
  /** Hero promise headline that lives on top of the offer block (the one that should land at top of viewport when sticky CTA is tapped). */
  heroPromise: string;
  painSection: string;
  /** 4-5 short, hyper-specific painful moments the ICP recognizes herself in. */
  painPoints: string[];
  /** 3 transformation cards (what changes for you). */
  benefits: Benefit[];
  ingredientCopy: string;
  /** DEPRECATED — kept for backward compat. Prefer ingredientDetails. */
  ingredients: string[];
  /** Each ingredient with its benefit + (optional) origin. */
  ingredientDetails: IngredientDetail[];
  /** Anti-claims chips — what the formula does NOT contain. */
  antiClaims: string[];
  /** Comparison table rows. */
  comparison: ComparisonRow[];
  howToUse: string;
  howToUseSteps: { title: string; description: string }[];
  usageFrequency: string;
  expectedTimeline: { when: string; result: string }[];
  usageTips: string[];
  /** Product-specific FAQ — addresses purchase objections, not site-wide topics. */
  productFaqs: FAQItem[];
  /** Custom guarantee copy for this product (golden seal section). */
  guaranteeText?: string;
  offerNudge: string;
  images: {
    hero: string;
    ingredients: string;
    lifestyle: string;
  };
  offers: ProductOffer[];
  reviews: ProductReview[];
  /** Total review count to display in summary (e.g., 247 — supports realistic social proof). */
  ratingCount: number;
  crossSellPriority: ProductId[];
  crossSellText: Partial<Record<ProductId, string>>;
}
