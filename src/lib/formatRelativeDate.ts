type RelativeDateUnit = Intl.RelativeTimeFormatUnit;

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

const RELATIVE_UNITS: Array<{ unit: RelativeDateUnit; ms: number }> = [
  { unit: 'year', ms: YEAR_MS },
  { unit: 'month', ms: MONTH_MS },
  { unit: 'week', ms: WEEK_MS },
  { unit: 'day', ms: DAY_MS },
  { unit: 'hour', ms: HOUR_MS },
  { unit: 'minute', ms: MINUTE_MS },
];

interface FormatRelativeDateOptions {
  short?: boolean;
}

export function formatRelativeDate(dateInput: string | Date, options?: FormatRelativeDateOptions): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);

  if (absDiffMs < MINUTE_MS) return options?.short ? 'now' : 'just now';

  const formatter = new Intl.RelativeTimeFormat('en', {
    numeric: 'auto',
    style: options?.short ? 'short' : 'long',
  });

  for (const { unit, ms } of RELATIVE_UNITS) {
    if (absDiffMs >= ms) {
      const value = Math.round(diffMs / ms);
      return formatter.format(value, unit);
    }
  }

  return formatter.format(Math.round(diffMs / MINUTE_MS), 'minute');
}
