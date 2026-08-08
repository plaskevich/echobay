import styled from 'styled-components';

import { PAGE_SIZE_OPTIONS } from '@/lib/constants/listings';

export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: PageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: PageSize) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onPageChange, onPageSizeChange }: PaginationProps) {
  if (total === 0) return null;

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    if (start > 2) pages.push('ellipsis');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push('ellipsis');

    pages.push(totalPages);
    return pages;
  };

  return (
    <Container>
      <PageControls>
        <NavButton
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
          data-testid="previous-page-button"
        >
          <i className="hn hn-angle-left" />
        </NavButton>

        {getPageNumbers().map((p, i) =>
          p === 'ellipsis' ? (
            <Ellipsis key={`ellipsis-${i}`}>…</Ellipsis>
          ) : (
            <PageButton key={p} $active={p === page} onClick={() => onPageChange(p)}>
              {p}
            </PageButton>
          )
        )}

        <NavButton
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
          data-testid="next-page-button"
        >
          <i className="hn hn-angle-right" />
        </NavButton>
      </PageControls>

      <SizeSelector>
        <SizeLabel>Show</SizeLabel>
        <SizeSelect value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value) as PageSize)}>
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </SizeSelect>
        <SelectChevron className="hn hn-chevron-down" aria-hidden="true" />
      </SizeSelector>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 1.5rem 0 0.5rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.75rem;
    padding: 1rem 0 0.25rem;
  }
`;

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text.secondary};
  cursor: pointer;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.black.main};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const PageButton = styled.button<{ $active: boolean }>`
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.375rem;
  border: 1px solid ${({ $active, theme }) => ($active ? theme.black.main : theme.border.primary)};
  background: ${({ $active, theme }) => ($active ? theme.black.main : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.text.inverse : theme.text.primary)};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.border.hover};
  }
`;

const Ellipsis = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 2rem;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.875rem;
`;

const SizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const SelectChevron = styled.i`
  position: absolute;
  right: 0.5rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.text.secondary};
  pointer-events: none;
`;

const SizeLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const SizeSelect = styled.select`
  appearance: none;
  box-sizing: content-box;
  width: 1.8rem; /* fits the widest option (240) */
  padding: 0.3rem 1.5rem 0.3rem 0.5rem;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.border.primary};
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.border.hover};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.border.hover};
  }
`;
