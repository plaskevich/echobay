import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'echobay-recently-viewed';
const MAX_RECENTLY_VIEWED = 30;

interface RecentlyViewedState {
  ids: string[];
  addView: (id: string) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      ids: [],
      addView: (id) => {
        const current = get().ids;
        const next = [id, ...current.filter((existing) => existing !== id)].slice(0, MAX_RECENTLY_VIEWED);
        if (next.length === current.length && next.every((value, index) => value === current[index])) return;
        set({ ids: next });
      },
      clear: () => set({ ids: [] }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ ids: state.ids }),
    }
  )
);
