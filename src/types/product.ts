export type ProductId = "breath_drops" | "foot_spray" | "nail_serum";
export type OfferId = "one" | "two" | "three" | "upsell_99";

export interface ProductOffer {
  offerId: "one" | "two" | "three";
  quantity: 1 | 2 | 3;
  price: 199 | 279 | 349;
  label: string;
  badge?: string;
}

export interface ProductReview {
  text: string;
  author: string;
  rating: number;
}

export interface Product {
  id: ProductId;
  slug: string;
  name: string;
  displayName: string;
  shortName: string;
  headline: string;
  subheading: string;
  painSection: string;
  ingredientCopy: string;
  howToUse: string;
  offerNudge: string;
  ingredients: string[];
  images: {
    hero: string;
    ingredients: string;
    lifestyle: string;
  };
  offers: ProductOffer[];
  reviews: ProductReview[];
  crossSellPriority: ProductId[];
  crossSellText: Partial<Record<ProductId, string>>;
}
