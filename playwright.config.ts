import { execSync } from 'child_process';
import crypto from 'crypto';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { defineConfig, devices } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sh = (cmd: string) => execSync(cmd, { cwd: __dirname, encoding: 'utf8' });

dotenv.config({ path: path.resolve(__dirname, '.env.test'), quiet: true });

// The local stack's keys are generated per `supabase start`, so a committed snapshot goes stale.
// Worse, neither key `supabase status` reports can drive the GoTrue admin API: both resolve to
// legacy HS256 JWTs, and GoTrue now verifies against an EC-only JWKS. That signing key is minted
// in memory and written neither to disk nor the database, so the only place to read it is the
// running container — and the only way to get an admin credential is to sign one with it.
const status = dotenv.parse(sh('supabase status -o env'));
const authContainer = sh('docker ps -q -f name=supabase_auth_').trim().split('\n')[0];
if (!authContainer) throw new Error('No supabase_auth_ container — is the local stack up? (`supabase start`)');

const gotrueEnv = sh(`docker inspect ${authContainer} --format '{{range .Config.Env}}{{println .}}{{end}}'`);
const jwtKeys = gotrueEnv.split('\n').find((l) => l.startsWith('GOTRUE_JWT_KEYS='));
if (!jwtKeys) throw new Error('GOTRUE_JWT_KEYS not in the auth container env — Supabase CLI version drift?');

const jwk = JSON.parse(jwtKeys.replace('GOTRUE_JWT_KEYS=', '')).find(
  (k: { kty?: string; d?: string }) => k.kty === 'EC' && k.d
);
if (!jwk) throw new Error('No EC private key in GOTRUE_JWT_KEYS — cannot sign a service_role token');

const b64 = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');
const issuedAt = Math.floor(Date.now() / 1000);
const claims = `${b64({ alg: 'ES256', typ: 'JWT', kid: jwk.kid })}.${b64({
  iss: 'supabase',
  role: 'service_role',
  aud: 'authenticated',
  iat: issuedAt,
  exp: issuedAt + 86400,
})}`;
const signature = crypto.sign('sha256', Buffer.from(claims), {
  key: crypto.createPrivateKey({ key: jwk, format: 'jwk' }),
  dsaEncoding: 'ieee-p1363', // JOSE wants raw r||s, not the DER default
});

process.env.VITE_SUPABASE_URL = status.API_URL;
process.env.VITE_SUPABASE_ANON_KEY = status.PUBLISHABLE_KEY ?? status.ANON_KEY; // older CLIs report only ANON_KEY
process.env.VITE_SUPABASE_SERVICE_ROLE_KEY = `${claims}.${signature.toString('base64url')}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: 'html',

  globalSetup: './e2e/setup/global-setup.ts',

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'e2e/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL!,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY!,
      VITE_STRIPE_PUBLISHABLE_KEY: process.env.VITE_STRIPE_PUBLISHABLE_KEY!,
    },
  },
});
