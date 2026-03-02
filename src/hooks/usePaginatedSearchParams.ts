import { useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

import { type PageSize } from '@/components/common/Pagination';
import { PAGE_SIZE_OPTIONS } from '@/lib/constants/listings';

function parsePage(value: string | null): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 1 ? Math.floor(parsed) : 1;
}

function parsePageSize(value: string | null): PageSize {
  const parsed = Number(value);
  return PAGE_SIZE_OPTIONS.includes(parsed as PageSize) ? (parsed as PageSize) : PAGE_SIZE_OPTIONS[0];
}

export function usePaginatedSearchParams(filterKey: unknown) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const currentPage = parsePage(searchParams.get('page'));
  const currentPageSize = parsePageSize(searchParams.get('pageSize'));

  const mountedRef = useRef(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', '1');
        return next;
      },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  const setPage = useCallback(
    (page: number, replace = false) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.set('page', String(page));
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  const handlePageSizeChange = useCallback(
    (size: PageSize) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('pageSize', String(size));
        next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  return { searchQuery, currentPage, currentPageSize, setPage, handlePageSizeChange } as const;
}
