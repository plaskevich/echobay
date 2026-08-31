import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ShippingAddress } from '@/api/shipping';

export type CheckoutStep = 'shipping' | 'payment' | 'summary';

interface CheckoutProgress {
  step: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  paymentIntentId: string | null;
  updatedAt: number;
}

interface CheckoutState {
  byListing: Record<string, CheckoutProgress>;
  update: (listingId: string, patch: Partial<Omit<CheckoutProgress, 'updatedAt'>>) => void;
  clear: (listingId: string) => void;
}

const STORAGE_KEY = 'echobay-checkout-progress';
// Cap how many in-flight checkouts we remember so localStorage can't grow unbounded.
const MAX_STORED = 20;

const emptyProgress = (): CheckoutProgress => ({
  step: 'shipping',
  shippingAddress: null,
  paymentIntentId: null,
  updatedAt: Date.now(),
});

const prune = (byListing: Record<string, CheckoutProgress>): Record<string, CheckoutProgress> => {
  const entries = Object.entries(byListing);
  if (entries.length <= MAX_STORED) return byListing;
  const kept = entries.sort(([, a], [, b]) => b.updatedAt - a.updatedAt).slice(0, MAX_STORED);
  return Object.fromEntries(kept);
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      byListing: {},
      update: (listingId, patch) => {
        const existing = get().byListing[listingId] ?? emptyProgress();
        const next: CheckoutProgress = { ...existing, ...patch, updatedAt: Date.now() };
        set({ byListing: prune({ ...get().byListing, [listingId]: next }) });
      },
      clear: (listingId) => {
        const rest = { ...get().byListing };
        delete rest[listingId];
        set({ byListing: rest });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ byListing: state.byListing }),
    }
  )
);
