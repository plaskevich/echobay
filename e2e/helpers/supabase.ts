import { createClient } from '@supabase/supabase-js';

export const supabaseAdmin = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!);

export async function createTestUser(email: string, password: string) {
  const {
    data: { users },
  } = await supabaseAdmin.auth.admin.listUsers();
  const existing = users?.find((u) => u.email === email);

  if (existing) {
    return { user: existing, email, password };
  }

  const {
    data: { user },
    error,
  } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw new Error(`Failed to create test user: ${error.message}`);

  return { user: user!, email, password };
}

export async function deleteTestUser(email: string) {
  const {
    data: { users },
  } = await supabaseAdmin.auth.admin.listUsers();
  const user = users?.find((u) => u.email === email);

  if (user) {
    await supabaseAdmin.auth.admin.deleteUser(user.id);
  }
}
