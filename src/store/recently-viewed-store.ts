import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RecentlyViewedItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice: number | null;
  image: string;
  categoryName: string | null;
  categorySlug: string | null;
};

const MAX_ITEMS = 10;

type RecentlyViewedStore = {
  items: RecentlyViewedItem[];
  addProduct: (item: RecentlyViewedItem) => void;
  clearAll: () => void;
};

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],

      addProduct: (item) => {
        const filtered = get().items.filter((i) => i.id !== item.id);
        set({ items: [item, ...filtered].slice(0, MAX_ITEMS) });
      },

      clearAll: () => set({ items: [] }),
    }),
    { name: 'recently-viewed-storage' },
  ),
);
