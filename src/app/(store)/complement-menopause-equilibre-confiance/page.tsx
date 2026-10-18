import { getProductById } from "@/config/products";
import ProductPageView from "../products/[slug]/ProductPageView";
import { notFound } from "next/navigation";

export default function NayloDirectPage() {
  const product = getProductById("naylo_menopause");
  if (!product) notFound();
  return <ProductPageView product={product} />;
}
