import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, size, color, qty = 1) => {
        const key = `${product.id}-${size}-${color}`;
        set((state) => {
          const existing = state.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.key === key ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { key, product, size, color, qty, price: product.price },
            ],
          };
        });
      },

      removeItem: (key) =>
        set((state) => ({ items: state.items.filter((i) => i.key !== key) })),

      updateQty: (key, qty) => {
        if (qty <= 0) {
          get().removeItem(key);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.key === key ? { ...i, qty } : i)),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },

      get totalPrice() {
        return get().items.reduce((sum, i) => sum + i.price * i.qty, 0);
      },
    }),
    {
      name: 'fss-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
