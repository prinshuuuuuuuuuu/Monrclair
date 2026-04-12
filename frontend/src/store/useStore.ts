import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  quantity: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: string[];
  searchQuery: string;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  setSearchQuery: (query: string) => void;
  cartCount: () => number;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      searchQuery: '',
      addToCart: (productId) =>
        set((state) => {
          const existing = state.cart.find((i) => i.productId === productId);
          if (existing) {
            return {
              cart: state.cart.map((i) =>
                i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { cart: [...state.cart, { productId, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          cart: quantity <= 0
            ? state.cart.filter((i) => i.productId !== productId)
            : state.cart.map((i) =>
                i.productId === productId ? { ...i, quantity } : i
              ),
        })),
      clearCart: () => set({ cart: [] }),
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      cartCount: () => get().cart.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'montclair-store' }
  )
);
