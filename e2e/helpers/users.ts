import { TEST_USER_PROFILE } from '../fixtures/profiles';
import { supabaseAdmin } from './supabase';

export const TEST_USER_EMAIL = 'test@echobay.local';
export const DEFAULT_PASSWORD = 'TestPassword123!';

export async function getTestUserId() {
  const {
    data: { users },
  } = await supabaseAdmin.auth.admin.listUsers();
  return users!.find((u) => u.email === TEST_USER_EMAIL)!.id;
}

export async function resetTestProfile() {
  const testUserId = await getTestUserId();
  await supabaseAdmin.from('profiles').upsert({ id: testUserId, ...TEST_USER_PROFILE });
}
