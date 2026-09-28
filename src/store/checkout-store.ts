import { create } from "zustand";
import type { ProductId } from "@/types/product";

type CheckoutStep =
  | "cart"
  | "checkout_form"
  | "upsell"
  | "submitting"
  | "done";

interface CheckoutState {
  step: CheckoutStep;
  customer: { full_name: string; phone: string } | null;
  isCheckoutOpen: boolean;
  upsellProduct: ProductId | null;
  lastOrderId: string | null;
  lastPublicId: string | null;
  /** Set when sending the order failed: the form reopens with this message instead of a fake thank-you page. */
  submitError: string | null;
}

interface CheckoutActions {
  openCheckout: () => void;
  closeCheckout: () => void;
  setCustomer: (customer: { full_name: string; phone: string }) => void;
  setStep: (step: CheckoutStep) => void;
  setUpsellProduct: (product: ProductId | null) => void;
  setLastOrder: (orderId: string, publicId: string) => void;
  failSubmit: (message: string) => void;
}

type CheckoutStore = CheckoutState & CheckoutActions;

export const useCheckoutStore = create<CheckoutStore>()((set) => ({
  step: "cart",
  customer: null,
  isCheckoutOpen: false,
  upsellProduct: null,
  lastOrderId: null,
  lastPublicId: null,
  submitError: null,

  openCheckout: () => set({ isCheckoutOpen: true, step: "checkout_form", submitError: null }),

  closeCheckout: () =>
    set({ isCheckoutOpen: false, step: "cart", customer: null, submitError: null }),

  setCustomer: (customer) => set({ customer }),

  setStep: (step) => set(step === "submitting" ? { step, submitError: null } : { step }),

  failSubmit: (message) => set({ step: "checkout_form", submitError: message }),

  setUpsellProduct: (product) => set({ upsellProduct: product }),

  setLastOrder: (orderId, publicId) =>
    set({ lastOrderId: orderId, lastPublicId: publicId }),
}));
