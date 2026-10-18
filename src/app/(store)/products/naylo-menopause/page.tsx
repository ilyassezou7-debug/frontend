import { getProductById } from "@/config/products";
import ProductPageView from "../[slug]/ProductPageView";
import { notFound } from "next/navigation";

export default function NayloProductAliasPage() {
  const product = getProductById("naylo_menopause");
  if (!product) notFound();
  return <ProductPageView product={product} />;
}
