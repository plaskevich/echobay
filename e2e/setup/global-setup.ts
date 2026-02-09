import { execSync } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { createTestUser, supabaseAdmin } from '../helpers/supabase';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

const TEST_USER_EMAIL = 'test@echobay.local';
const TEST_USER_PASSWORD = 'TestPassword123!';

export default async function globalSetup() {
  console.log('\n🔄 Resetting local Supabase database...');

  try {
    execSync('supabase db reset --yes 2>&1', {
      cwd: path.resolve(__dirname, '../..'),
      stdio: 'pipe',
      encoding: 'utf-8',
    });
    console.log('✅ Database reset complete.');
  } catch (error: unknown) {
    const output = (error as { stdout?: string }).stdout ?? '';
    if (output.includes('Seeding data') && output.includes('502')) {
      console.log('✅ Database reset complete (storage container still restarting — OK).');
    } else {
      console.error('❌ Failed to reset database. Is Supabase running? (`supabase start`)');
      console.error(output);
      throw error;
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 3000));
  console.log('👤 Creating test user and seeding data...');
  const { user } = await createTestUser(TEST_USER_EMAIL, TEST_USER_PASSWORD);

  await supabaseAdmin.from('profiles').upsert({
    id: user.id,
    username: 'testuser',
    about: 'E2E test user account',
    location: 'Test City',
  });

  const { data: listings } = await supabaseAdmin
    .from('listings')
    .insert([
      {
        owner_id: user.id,
        title: 'Abbey Road',
        artist: 'The Beatles',
        format: 'cassette',
        price: 9.99,
        condition: 'Near Mint',
        description: 'Classic Beatles album in excellent condition.',
        status: 'active',
        images: [],
      },
      {
        owner_id: user.id,
        title: 'Kind of Blue',
        artist: 'Miles Davis',
        format: 'vinyl',
        price: 32.5,
        condition: 'Very Good Plus',
        description: 'The quintessential jazz album.',
        status: 'active',
        images: [],
      },
      {
        owner_id: user.id,
        title: 'OK Computer',
        artist: 'Radiohead',
        format: 'cd',
        price: 12,
        condition: 'Good',
        description: 'A groundbreaking alternative rock album.',
        status: 'active',
        images: [],
      },
    ])
    .select('id');

  if (listings) {
    await supabaseAdmin.from('listing_genres').insert([
      { listing_id: listings[0].id, genre_id: 'a0000000-0000-0000-0000-000000000001' },
      { listing_id: listings[0].id, genre_id: 'a0000000-0000-0000-0000-000000000006' },
      { listing_id: listings[1].id, genre_id: 'a0000000-0000-0000-0000-000000000002' },
      { listing_id: listings[2].id, genre_id: 'a0000000-0000-0000-0000-000000000001' },
      { listing_id: listings[2].id, genre_id: 'b0000000-0000-0000-0000-000000000001' },
    ]);
  }

  console.log('✅ Test data seeded successfully.\n');
}
