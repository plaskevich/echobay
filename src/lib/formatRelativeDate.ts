const MINUTE_MS = 6e4;

const UNITS: [ms: number, unit: Intl.RelativeTimeFormatUnit][] = [
  [31536e6, 'year'],
  [2592e6, 'month'],
  [6048e5, 'week'],
  [864e5, 'day'],
  [36e5, 'hour'],
  [MINUTE_MS, 'minute'],
];

interface FormatRelativeDateOptions {
  short?: boolean;
}

export function formatRelativeDate(dateInput: string | Date, options?: FormatRelativeDateOptions): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = date.getTime() - Date.now();
  const absDiffMs = Math.abs(diffMs);

  if (absDiffMs < MINUTE_MS) return options?.short ? 'now' : 'just now';

  const formatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
    style: options?.short ? 'narrow' : 'long',
  });

  const [ms, unit] = UNITS.find(([threshold]) => absDiffMs >= threshold) ?? UNITS[UNITS.length - 1];
  return formatter.format(Math.round(diffMs / ms), unit);
}
