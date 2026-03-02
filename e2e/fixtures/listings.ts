export const HOME_LISTINGS = [
  {
    title: 'Nevermind',
    artist: 'Nirvana',
    format: 'vinyl',
    price: 25.0,
    shipping_price: 3.0,
    condition: 'Near Mint (NM)',
    description: 'Classic grunge album',
    status: 'active',
    images: [],
  },
  {
    title: 'Blue Train',
    artist: 'John Coltrane',
    format: 'cd',
    price: 15.0,
    shipping_price: 2.0,
    condition: 'Very Good Plus (VG+)',
    description: 'Essential jazz recording',
    status: 'active',
    images: [],
  },
  {
    title: 'Random Access Memories',
    artist: 'Daft Punk',
    format: 'vinyl',
    price: 45.0,
    shipping_price: 5.0,
    condition: 'Mint (M)',
    description: 'Grammy-winning electronic masterpiece',
    status: 'active',
    images: [],
  },
  {
    title: 'Rumours',
    artist: 'Fleetwood Mac',
    format: 'tape',
    price: 8.5,
    shipping_price: 2.0,
    condition: 'Good (G)',
    description: 'Iconic soft rock album',
    status: 'active',
    images: [],
  },
  {
    title: 'Thriller',
    artist: 'Michael Jackson',
    format: 'cd',
    price: 20.0,
    shipping_price: 2.5,
    condition: 'Near Mint (NM)',
    description: 'Best-selling pop album of all time',
    status: 'active',
    images: [],
  },
] as const;

export const HOME_LISTING_GENRES = [
  ['a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001'],
  ['a0000000-0000-0000-0000-000000000002'],
  ['a0000000-0000-0000-0000-000000000003'],
  ['a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000006'],
  ['a0000000-0000-0000-0000-000000000006'],
] as const;

const EXTRA_FORMATS = ['vinyl', 'cd', 'tape'] as const;
export const HOME_EXTRA_LISTINGS = Array.from({ length: 20 }, (_, i) => ({
  title: `Extra Album ${String(i + 1).padStart(2, '0')}`,
  artist: `Extra Artist ${String(i + 1).padStart(2, '0')}`,
  format: EXTRA_FORMATS[i % EXTRA_FORMATS.length],
  price: 10 + i,
  shipping_price: 2.0,
  condition: 'Very Good (VG)' as const,
  description: `Extra listing ${i + 1}`,
  status: 'active' as const,
  images: [] as string[],
}));

export const BUYER_LISTING = {
  title: 'In Rainbows',
  artist: 'Radiohead',
  format: 'vinyl',
  price: 35.0,
  shipping_price: 4.5,
  condition: 'Near Mint (NM)',
  description: 'Beautiful pressing of the iconic Radiohead album.',
  status: 'active',
  images: [],
  year: 2007,
  label: 'XL Recordings',
} as const;

export const BUYER_LISTING_GENRES = [
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
] as const;

export const OWNER_LISTINGS = [
  {
    title: 'Homework',
    artist: 'Daft Punk',
    format: 'cd',
    price: 28.0,
    shipping_price: 0,
    condition: 'Very Good Plus (VG+)',
    description: 'Classic electronic debut album.',
    status: 'active',
    images: [],
  },
  {
    title: 'Discovery',
    artist: 'Daft Punk',
    format: 'vinyl',
    price: 30.0,
    shipping_price: 3.0,
    condition: 'Mint (M)',
    status: 'active',
    images: [],
  },
  {
    title: 'Human After All',
    artist: 'Daft Punk',
    format: 'vinyl',
    price: 22.0,
    shipping_price: 2.5,
    condition: 'Good (G)',
    status: 'hidden',
    images: [],
  },
  {
    title: 'Alive 2007',
    artist: 'Daft Punk',
    format: 'cd',
    price: 18.0,
    shipping_price: 2.0,
    condition: 'Near Mint (NM)',
    status: 'active',
    images: [],
  },
  {
    title: 'Musique Vol 1',
    artist: 'Daft Punk',
    format: 'cd',
    price: 15.0,
    shipping_price: 1.5,
    condition: 'Very Good (VG)',
    status: 'active',
    images: [],
  },
] as const;

export const EDITABLE_LISTING = {
  title: 'Editable Album',
  artist: 'Original Artist',
  format: 'cd',
  price: 15.0,
  shipping_price: 2.5,
  condition: 'Very Good (VG)',
  description: 'Original description',
  year: 2000,
  label: 'Original Label',
  status: 'active',
  images: [],
} as const;

export const PUBLIC_SELLER_LISTING = {
  title: 'Revolver',
  artist: 'The Beatles',
  format: 'vinyl',
  price: 40.0,
  shipping_price: 5.0,
  condition: 'Near Mint (NM)',
  status: 'active',
  images: [],
} as const;

export const CHECKOUT_LISTING = {
  title: 'The Dark Side of the Moon',
  artist: 'Pink Floyd',
  format: 'vinyl',
  price: 45.0,
  shipping_price: 5.0,
  condition: 'Near Mint (NM)',
  description: 'Legendary progressive rock album.',
  status: 'active',
  images: [],
} as const;

export const FREE_SHIPPING_LISTING = {
  title: 'Wish You Were Here',
  artist: 'Pink Floyd',
  format: 'cd',
  price: 20.0,
  shipping_price: 0,
  condition: 'Very Good Plus (VG+)',
  description: 'Beautiful Pink Floyd album.',
  status: 'active',
  images: [],
} as const;

export const MESSAGES_LISTING = {
  title: 'Vespertine',
  artist: 'Björk',
  format: 'vinyl',
  price: 38.0,
  shipping_price: 4.0,
  condition: 'Near Mint (NM)',
  description: 'Stunning electronic album.',
  status: 'active',
  images: [],
} as const;

export const MESSAGES_LISTING_2 = {
  title: 'Homogenic',
  artist: 'Björk',
  format: 'cd',
  price: 22.0,
  shipping_price: 3.0,
  condition: 'Very Good Plus (VG+)',
  description: 'Iconic electronic masterpiece.',
  status: 'active',
  images: [],
} as const;

export const ACCOUNT_BOUGHT_LISTING = {
  title: 'OK Computer',
  artist: 'Radiohead',
  format: 'vinyl',
  price: 32.0,
  shipping_price: 4.0,
  condition: 'Near Mint (NM)',
  description: 'Landmark alternative rock album.',
  status: 'active',
  images: [],
} as const;

export const ACCOUNT_SOLD_LISTING = {
  title: 'Kid A',
  artist: 'Radiohead',
  format: 'cd',
  price: 18.0,
  shipping_price: 2.5,
  condition: 'Very Good Plus (VG+)',
  description: 'Experimental electronic rock masterpiece.',
  status: 'sold',
  images: [],
} as const;

export const ACCOUNT_FAVORITE_LISTING = {
  title: 'Loveless',
  artist: 'My Bloody Valentine',
  format: 'vinyl',
  price: 55.0,
  shipping_price: 5.0,
  condition: 'Mint (M)',
  description: 'Definitive shoegaze album.',
  status: 'active',
  images: [],
} as const;

export const RATING_LISTING = {
  title: 'The Velvet Underground & Nico',
  artist: 'The Velvet Underground',
  format: 'vinyl',
  price: 50.0,
  shipping_price: 4.0,
  condition: 'Near Mint (NM)',
  description: 'Iconic debut album.',
  status: 'active',
  images: [],
} as const;
