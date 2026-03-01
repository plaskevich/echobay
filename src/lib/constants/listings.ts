export const FORMATS = ['vinyl', 'cd', 'tape'] as const;
export type Format = (typeof FORMATS)[number];

export const FORMAT_OPTIONS = [
  { value: '', label: 'Select a format' },
  { value: 'vinyl', label: 'Vinyl' },
  { value: 'cd', label: 'CD' },
  { value: 'tape', label: 'Tape' },
] as const;

export const CONDITION_OPTIONS = [
  { value: '', label: 'Select condition' },
  { value: 'Mint (M)', label: 'Mint (M)' },
  { value: 'Near Mint (NM)', label: 'Near Mint (NM)' },
  { value: 'Very Good Plus (VG+)', label: 'Very Good Plus (VG+)' },
  { value: 'Very Good (VG)', label: 'Very Good (VG)' },
  { value: 'Good Plus (G+)', label: 'Good Plus (G+)' },
  { value: 'Good (G)', label: 'Good (G)' },
  { value: 'Fair (F)', label: 'Fair (F)' },
  { value: 'Poor (P)', label: 'Poor (P)' },
] as const;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGES_PER_LISTING = 8;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const MAX_IMAGE_DIMENSION = 1920;

export const MAX_MAIN_GENRES = 3;
export const MAX_SUBGENRES = 5;

export const CURRENCY_SYMBOL = '\u20AC'; // €
