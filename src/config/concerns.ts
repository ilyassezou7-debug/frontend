/**
 * The store is sold by problem, not by product: a visitor arrives with a worry ("my hair is falling"), not with
 * "rosemary serum" in mind. Each product slug maps to the concern it answers, phrased the way the customer would say it.
 * Order = display order on the homepage.
 */
export const CONCERNS: { slug: string; label: string; question: string }[] = [
  { slug: "hair-serum", label: "تساقط الشعر", question: "الشعر كيطيح فالمشط والوسادة؟" },
  { slug: "breath-drops", label: "رائحة الفم", question: "كتحشمي تهضري من قريب؟" },
  { slug: "foot-spray", label: "رائحة القدمين", question: "كتقلقي فاش كتحيدي الصباط؟" },
  { slug: "nail-serum", label: "فطريات الأظافر", question: "ولّيتي كتخبي أظافرك؟" },
  { slug: "joint-capsules", label: "آلام المفاصل", question: "الركبة والظهر ما بقاوش كيعاونوك؟" },
];

export function concernFor(slug: string) {
  return CONCERNS.find((c) => c.slug === slug);
}
