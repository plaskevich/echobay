import { useEffect, useRef } from 'react';

import { logView } from '@/api/activity';
import { useAuthStore } from '@/store/auth-store';
import { useRecentlyViewedStore } from '@/store/recently-viewed-store';

export function useLogView(listingId: string | undefined) {
  const userId = useAuthStore((state) => state.user?.id);
  const addView = useRecentlyViewedStore((state) => state.addView);
  const loggedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!listingId) return;
    if (loggedRef.current === listingId) return;
    loggedRef.current = listingId;

    addView(listingId);

    if (userId) {
      void (async () => {
        try {
          await logView(userId, listingId);
        } catch {
          // ignore: view logging is best-effort
        }
      })();
    }
  }, [listingId, userId, addView]);
}
