import { useCartStore } from "@/store/cart-store";
import { useCheckoutStore } from "@/store/checkout-store";
import { trackAddToCart, trackInitiateCheckout } from "@/lib/tracking";
import { generateEventId } from "@/lib/event-id";
import type { Product, ProductOffer } from "@/types/product";

/**
 * One tap from a product page to the name + phone form. The cart drawer used to sit in between: an extra screen
 * for a buyer who has already chosen. The drawer is still there for anyone who opens the cart from the header.
 *
 * Tapping twice (form closed, then reopened) must not double the order, so an offer already in the cart is not
 * added again. The form lists every cart line with its price, so the buyer always sees what they confirm.
 */
export function buyNow(product: Pick<Product, "id">, offer: ProductOffer) {
  const cart = useCartStore.getState();
  const alreadyIn = cart.items.some((i) => i.productId === product.id && i.offerId === offer.offerId);
  if (!alreadyIn) {
    cart.addOffer({
      productId: product.id,
      offerId: offer.offerId,
      quantity: 1,
      unitCount: offer.quantity,
      price: offer.price,
      source: "product_page",
    });
    trackAddToCart(product.id, offer.price, generateEventId());
  }
  trackInitiateCheckout(useCartStore.getState().getTotal(), generateEventId());
  useCheckoutStore.getState().openCheckout();
}
