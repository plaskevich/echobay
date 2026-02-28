import type { ListingStatus } from '@/api/listings';

import { CURRENCY_SYMBOL, FORMAT_OPTIONS } from './constants/listings';

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
}

export function getFormatLabel(value?: string | null): string | null {
  if (!value) return null;
  const option = FORMAT_OPTIONS.find((opt) => opt.value === value);
  return option?.label ?? capitalize(value);
}

export function getStatusLabel(status?: ListingStatus): string {
  if (!status) return '';
  switch (status) {
    case 'sold':
      return 'Sold';
    case 'hidden':
      return 'Hidden';
    default:
      return status;
  }
}
