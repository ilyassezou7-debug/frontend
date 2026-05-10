import type { Product, ProductId } from "@/types/product";

export const PRODUCTS: Product[] = [
  {
    id: "breath_drops",
    slug: "breath-drops",
    name: "قطرات القرنفل والنعناع",
    displayName: "قطرات القرنفل والنعناع لنفس منتعش",
    shortName: "قطرات النفس",
    headline: "نفس منتعش... وثقة أكبر فكل لحظة قريبة.",
    subheading: "قطرات طبيعية بالقرنفل والنعناع باش تحافظي على نفس منتعش طول اليوم وتتخلصي من الإحراج بصفة نهائية.",
    painSection:
      "كتحسي بالخجل وانتِ كتهضري مع الناس قراب؟ كتتراجعي اللور بسبب الخوف من رائحة الفم؟ هاد الإحساس كيأثر على ثقتك فراسك وكيفقدك بزاف ديال اللحظات الزوينة. حنا فاهمينك، ومكوناتنا الطبيعية خدمات مع بعضياتها باش تساعدك ترجعي ثقتك وتتخلصي من هاد المشكل من الجدر.",
    ingredientCopy:
      "القرنفل معروف من زمان عند جداتنا بخصائصه المضادة للبكتيريا والفطريات في الفم. والنعناع كيعطي إحساس بالانتعاش الفوري اللي كيدوم. جمعناهم بجوج فقطرات صغيرة وسهلة الاستعمال باش تكون معاك فين ما مشيتي.",
    howToUse:
      "ضعي 3-5 قطرات على لسانك أو حلّيها في كأس ماء صغير. استعمليها كيفما احتجتي طول اليوم. مناسبة للاستعمال الدائم.",
    howToUseSteps: [
      {
        title: "هزّي القنينة مزيان",
        description: "قبل كل استعمال، هزّي القنينة شوية باش المكونات الطبيعية يخلطو مزيان.",
      },
      {
        title: "ضعي 3-5 قطرات",
        description: "حطّي 3 إلى 5 قطرات ديريكت على لسانك، ولا حلّيها فكاس ماء صغير وتمضمضي بيها 10 ثواني.",
      },
      {
        title: "استمتعي بالانتعاش",
        description: "غادي تحسي بانتعاش فوري كيدوم لساعات. عاوديها كل ما حسيتي بالحاجة، خصوصاً قبل الخروج أو اللقاءات.",
      },
    ],
    usageFrequency: "2 إلى 3 مرات فاليوم",
    expectedTimeline: [
      { when: "من أول استعمال", result: "انتعاش فوري ونفس منعش" },
      { when: "بعد 7 أيام", result: "نقصان واضح فالبكتيريا المسببة للريحة" },
      { when: "بعد 21 يوم", result: "نفس صحي ومنتعش بصفة دائمة وثقة كاملة" },
    ],
    usageTips: [
      "خبّي القنينة فبلاصة باردة وبعيدة على ضو الشمس.",
      "آمنة للاستعمال اليومي – بدون أي أضرار جانبية.",
      "للحصول على أحسن نتيجة، استعمليها بعد غسل الأسنان.",
    ],
    offerNudge: "الثقة ماعندهاش ثمن – وهاد القطرات تساعدك تلقيها كل يوم.",
    ingredients: ["زيت القرنفل", "زيت النعناع", "زيت جوز الهند", "زيت اللوز"],
    images: {
      hero: "/images/placeholders/breath-hero.svg",
      ingredients: "/images/placeholders/breath-ingredients.svg",
      lifestyle: "/images/placeholders/breath-lifestyle.svg",
    },
    offers: [
      { offerId: "one", quantity: 1, price: 199, label: "تجربة أولى" },
      {
        offerId: "two",
        quantity: 2,
        price: 279,
        label: "الأكثر طلبا",
        badge: "الأكثر طلبا",
      },
      {
        offerId: "three",
        quantity: 3,
        price: 349,
        label: "أفضل قيمة",
        badge: "أفضل قيمة",
      },
    ],
    reviews: [
      {
        text: "والله من ما استعملتها بديت نحس بارتياح كبير. كنت دايما خايفة نهضر مع الناس وها دابا رجعلي الثقة.",
        author: "سلمى م.",
        rating: 5,
      },
      {
        text: "مكونات طبيعية وريحتها زوينة. كنصحح بيها لكل من عندو نفس المشكلة.",
        author: "فاطمة ز.",
        rating: 5,
      },
      {
        text: "جربت بزاف حوايج قبل وهادي هي اللي خدمات معايا فعلاً. التوصيل جاء بسرعة والتغليف مزيان.",
        author: "نوال ع.",
        rating: 4,
      },
    ],
    crossSellPriority: ["foot_spray", "nail_serum"],
    crossSellText: {
      foot_spray: "كملي روتين الثقة من النفس حتى للرجلين.",
      nail_serum: "العناية الكاملة تبدأ من الأظافر للنفس.",
    },
  },
  {
    id: "foot_spray",
    slug: "foot-spray",
    name: "بخاخ الشبة وزيت شجرة الشاي",
    displayName: "بخاخ الشبة وزيت شجرة الشاي لانتعاش القدمين",
    shortName: "بخاخ القدمين",
    headline:
      "تخلصي من رائحة وعرق القدمين... ورجعي راحتك وثقتك فكل خطوة.",
    subheading:
      "بخاخ طبيعي بالشبة وزيت شجرة الشاي باش تقضي على البكتيريا المسببة للرائحة وتحافظي على انتعاش رجليك طول اليوم.",
    painSection:
      "شحال من مرة حشمتي تحيدي صباطك فدار عائلتك أو صحاباتك؟ رائحة وعرق القدمين مشكل كيقلق بزاف ديال العيالات وكيخليهم ديما شادين الهم. هاد البخاخ الطبيعي صممناه خصيصاً باش يخليك تواجهي هاد الموقف بكل ثقة وارتياح، بلا حشمة بلا إحراج.",
    ingredientCopy:
      "الشبة المغربية الحرة معروفة بخصائصها الفعالة في امتصاص العرق والتحكم في الرطوبة. وزيت شجرة الشاي كيقضي على البكتيريا المسببة للروائح. هاد الجوج فبخاخ واحد كيعطيوك حماية وانتعاش كيدوم.",
    howToUse:
      "بعد الاستحمام أو قبل لبس الحذاء، رشّي على القدمين النظيفة والجافة. دعيها تجفف قبل لبس الجوارب. استعملي يومياً للحصول على أحسن نتيجة.",
    howToUseSteps: [
      {
        title: "نظّفي وجفّفي القدمين",
        description: "غسلي رجليك مزيان بالماء والصابون، وجفّفيهم كاملاً، خصوصاً بين الصوابع.",
      },
      {
        title: "رشّي البخاخ على القدمين",
        description: "رجّي القنينة، وبعدا رشّي 3-4 رشات على كل قدم، مع التركيز بين الصوابع وتحت القدم.",
      },
      {
        title: "خلّيها تجفف لوحدها",
        description: "تسناي 30 ثانية باش تجفف بشكل طبيعي قبل ما تلبسي التقاشر ولا الصباط.",
      },
    ],
    usageFrequency: "مرة فاليوم – الصباح ولا قبل الخروج",
    expectedTimeline: [
      { when: "من أول استعمال", result: "إحساس بالانتعاش وجفاف فوري للقدمين" },
      { when: "بعد 5 أيام", result: "نقصان كبير فالعرق والروائح غير المرغوب فيها" },
      { when: "بعد 14 يوم", result: "قدمين جافتين ومنتعشتين طول اليوم بثقة كاملة" },
    ],
    usageTips: [
      "استعمليها بانتظام يومياً باش يبقا المفعول مستمر.",
      "آمنة 100% – ما كتسببش حساسية ولا حكاك.",
      "تنفع تشي الصباط نفسو من الداخل لقتل البكتيريا.",
    ],
    offerNudge: "قدماك تستحقان الراحة – والانتعاش يبدأ من اليوم.",
    ingredients: ["شبة طبيعية", "زيت شجرة الشاي", "ماء منقى", "إيثانول نباتي"],
    images: {
      hero: "/images/placeholders/foot-hero.svg",
      ingredients: "/images/placeholders/foot-ingredients.svg",
      lifestyle: "/images/placeholders/foot-lifestyle.svg",
    },
    offers: [
      { offerId: "one", quantity: 1, price: 199, label: "تجربة أولى" },
      {
        offerId: "two",
        quantity: 2,
        price: 279,
        label: "الأكثر طلبا",
        badge: "الأكثر طلبا",
      },
      {
        offerId: "three",
        quantity: 3,
        price: 349,
        label: "أفضل قيمة",
        badge: "أفضل قيمة",
      },
    ],
    reviews: [
      {
        text: "مافيهاش كلام. من أول استعمال حسيت بفرق كبير. دابا مابقيتش خايفة نخلع الحذاء في أي مكان.",
        author: "حنان ب.",
        rating: 5,
      },
      {
        text: "منتج زوين بصح. ريحته طبيعية ومش قوية. كنستعملو كل يوم الصبح.",
        author: "خديجة أ.",
        rating: 5,
      },
      {
        text: "الشبة وزيت شجرة الشاي خليت رجليا مرتاحين. نوصي بيه بصح.",
        author: "مريم ل.",
        rating: 4,
      },
    ],
    crossSellPriority: ["breath_drops", "nail_serum"],
    crossSellText: {
      breath_drops: "زيدي نفس منتعش مع راحة الرجلين لثقة كاملة.",
      nail_serum: "العناية الكاملة كتشمل الرجلين والأظافر معاً.",
    },
  },
  {
    id: "nail_serum",
    slug: "nail-serum",
    name: "سيروم الثوم والخل",
    displayName: "سيروم الثوم والخل للعناية بمظهر الأظافر",
    shortName: "سيروم الأظافر",
    headline:
      "أظافر نقية وصحية... تخلصي من الفطريات ورجعي جمال يديك ورجليك.",
    subheading:
      "سيروم طبيعي وفعال بالثوم والخل باش تعالجي فطريات الأظافر (السوسة) وترجعي ليهم اللون والمظهر الطبيعي ديالهم.",
    painSection:
      "كتخبي أظافرك حيت اللون ديالهم تبدل أو فيهم السوسة؟ هاد المشكل كيأثر بزاف على أنوثتك وكيخليك تحشمي تبيني يديك أو تلبسي صندالة فصيف. السيروم ديالنا الطبيعي غيساعدك تقضي على الفطريات من الجدر وترجعي أظافرك صحيين ونقيين كيفما بغيتيهم.",
    ingredientCopy:
      "الثوم غني بمضادات الفطريات الطبيعية اللي كتقضي على السوسة من الجدر. وخل التفاح العضوي كينقي الظفر وكيرجع ليه اللمعان ديالو. تركيبة خفيفة وسريعة الامتصاص باش تعطيك نتيجة فمدة قصيرة.",
    howToUse:
      "ضعي طبقة رفيعة على كل ظفر مرة أو مرتين في اليوم. دعيها تجفف بشكل طبيعي. استمري في الاستعمال يومياً للحصول على أفضل النتائج.",
    howToUseSteps: [
      {
        title: "نظّفي وجفّفي الأظافر",
        description: "غسلي يديك ولا رجليك مزيان وجفّفيهم. بسّاي ما يكون شي طلاء على الأظافر.",
      },
      {
        title: "حطّي قطرة وحدة على كل ظفر",
        description: "بالقطّارة، حطّي قطرة سيروم على الظفر المصاب، ودلكيها بلطف باش تدخل تحت الظفر.",
      },
      {
        title: "خلّيها تتشرب فالظفر",
        description: "تسناي دقائق قليلة باش تجفف. ما تغسليش يديك ولا رجليك على الأقل ساعة من بعد.",
      },
    ],
    usageFrequency: "مرتين فاليوم – الصباح والليل",
    expectedTimeline: [
      { when: "بعد 7 أيام", result: "بداية ظهور لون طبيعي ولمعان فالظفر" },
      { when: "بعد 21 يوم", result: "نقصان واضح فالفطريات وتحسن مظهر الظفر" },
      { when: "بعد 6 إلى 8 أسابيع", result: "أظافر جديدة، صحية، نقية وقوية" },
    ],
    usageTips: [
      "الانتظام هو السر – الأظافر كتاخد وقت باش تتجدد طبيعياً.",
      "خبّي السيروم بعيد على الحرارة وضو الشمس.",
      "تجنّبي طلاء الأظافر طول مدة العلاج باش تخدم التركيبة بشكل أحسن.",
    ],
    offerNudge: "الروتين البسيط هو السر – والأظافر شكرانك غادي يبان.",
    ingredients: ["زيت الثوم", "خل التفاح العضوي", "زيت جوجوبا", "فيتامين E"],
    images: {
      hero: "/images/placeholders/nail-hero.svg",
      ingredients: "/images/placeholders/nail-ingredients.svg",
      lifestyle: "/images/placeholders/nail-lifestyle.svg",
    },
    offers: [
      { offerId: "one", quantity: 1, price: 199, label: "تجربة أولى" },
      {
        offerId: "two",
        quantity: 2,
        price: 279,
        label: "الأكثر طلبا",
        badge: "الأكثر طلبا",
      },
      {
        offerId: "three",
        quantity: 3,
        price: 349,
        label: "أفضل قيمة",
        badge: "أفضل قيمة",
      },
    ],
    reviews: [
      {
        text: "سيروم رائع! من ما بديت نستعملو لاحظت فرق واضح في مظهر أظافري. شكراً أطلس بيور!",
        author: "أسماء ك.",
        rating: 5,
      },
      {
        text: "كنت متشككة فالبداية بصح هاد السيروم غيّر نظرتي. أظافري رجعو ينبسطو أكثر.",
        author: "رقية م.",
        rating: 5,
      },
      {
        text: "مكونات بسيطة وطبيعية وخدامة. التوصيل جاء في ثلاثة أيام والتغليف أنيق.",
        author: "زينب ه.",
        rating: 4,
      },
    ],
    crossSellPriority: ["foot_spray", "breath_drops"],
    crossSellText: {
      foot_spray: "العناية بالأظافر كتكون أحسن مع روتين انتعاش القدمين.",
      breath_drops: "روتين كامل من الأظافر للنفس لثقة تامة.",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: ProductId): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getUpsellProduct(cartProductIds: ProductId[]): ProductId | null {
  if (cartProductIds.length === 0) return null;

  // If all three in cart, skip upsell
  const allIds: ProductId[] = ["breath_drops", "foot_spray", "nail_serum"];
  if (allIds.every((id) => cartProductIds.includes(id))) return null;

  // If two products, show the missing third
  if (cartProductIds.length >= 2) {
    const missing = allIds.find((id) => !cartProductIds.includes(id));
    return missing ?? null;
  }

  // Single product: use crossSellPriority
  const primary = cartProductIds[0];
  const product = getProductById(primary);
  if (!product) return null;

  for (const crossId of product.crossSellPriority) {
    if (!cartProductIds.includes(crossId)) return crossId;
  }

  return null;
}
