import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
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
          <PiCaretLeft size={18} />
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
          <PiCaretRight size={18} />
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
  width: 2rem;
  height: 2rem;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.text.accent};
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
  border: 1px solid ${({ $active, theme }) => ($active ? theme.primary.main : theme.border.primary)};
  background: ${({ $active, theme }) => ($active ? theme.primary.main : 'transparent')};
  color: ${({ $active, theme }) => ($active ? '#fff' : theme.text.primary)};
  font-size: 0.875rem;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background-color: ${({ $active, theme }) => ($active ? theme.primary.hover : theme.background.secondary)};
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
`;

const SizeLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.text.secondary};
`;

const SizeSelect = styled.select`
  padding: 0.3rem;
  border: 1px solid ${({ theme }) => theme.border.primary};
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.875rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary.main};
  }
`;
