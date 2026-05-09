import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/order";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addOffer: (item: CartItem) => void;
  removeItem: (productId: string, offerId: string) => void;
  decrementItem: (productId: string, offerId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addOffer: (item: CartItem) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.offerId === item.offerId
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId && i.offerId === item.offerId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId: string, offerId: string) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.offerId === offerId)
          ),
        }));
      },

      decrementItem: (productId: string, offerId: string) => {
        set((state) => {
          const item = state.items.find(
            (i) => i.productId === productId && i.offerId === offerId
          );
          if (!item) return state;
          if (item.quantity <= 1) {
            return {
              items: state.items.filter(
                (i) => !(i.productId === productId && i.offerId === offerId)
              ),
            };
          }
          return {
            items: state.items.map((i) =>
              i.productId === productId && i.offerId === offerId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),

      closeCart: () => set({ isOpen: false }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "atlas-pure-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
