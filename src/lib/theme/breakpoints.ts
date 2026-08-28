/**
 * One constant per pixel value, shared by `min-width` and `max-width` queries.
 * `md` is deliberately used by both, preserving the existing 1px overlap at
 * exactly 768px rather than silently changing which side wins.
 */
export const breakpoint = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
} as const;
