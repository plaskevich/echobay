# EchoBay

[![CI & Deploy](https://github.com/plaskevich/EchoBay/actions/workflows/ci-deploy.yml/badge.svg)](https://github.com/plaskevich/EchoBay/actions/workflows/ci-deploy.yml)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel)](https://vercel.com)

A marketplace for buying and selling music media - vinyl records, CDs, and cassettes. Users can list items, browse and search listings, message sellers, check out with Stripe, and manage orders.

## Prerequisites

- [Node.js](https://nodejs.org/) 22+
- [pnpm](https://pnpm.io/) 9+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Docker](https://www.docker.com/) (required by Supabase CLI)

## Getting Started

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**

   Create a `.env.local` file in the project root:

   ```env
   VITE_SUPABASE_URL=<your-supabase-project-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   VITE_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
   ```

3. **Start Supabase locally:**

   ```bash
   supabase start
   ```

   This spins up a local Supabase instance with PostgreSQL, Auth, Storage, and Edge Functions. The CLI will print the local URLs and keys you can use for `.env.local`.

4. **Run the dev server:**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`.

## Scripts

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `pnpm dev`     | Start the development server        |
| `pnpm build`   | Type-check and build for production |
| `pnpm preview` | Preview the production build        |
| `pnpm lint`    | Run ESLint                          |
| `pnpm format`  | Format code with Prettier           |

## E2E Tests

Tests use [Playwright](https://playwright.dev/) and run against a local Supabase instance. Stripe is mocked during tests.

### Setup

1. Make sure Supabase is running locally (`supabase start`).
2. Install Playwright browsers (first time only):

   ```bash
   pnpm exec playwright install --with-deps chromium
   ```

### Running Tests

```bash
# Headless
pnpm test:e2e

# With Playwright UI
pnpm test:e2e:ui

# Headed (browser visible)
pnpm test:e2e:headed
```

The global setup automatically resets the database, creates a test user (`test@echobay.local` / `TestPassword123!`), and seeds sample listings before each run.

### Test Structure

```
e2e/
├── fixtures/      # Test data (listings, profiles, checkout)
├── helpers/       # Utilities (Stripe mock, Supabase admin, users)
├── setup/         # Global setup and auth setup
└── specs/         # Test specs (auth, checkout, messages, etc.)
```

## CI/CD

Pushing to `main` triggers a GitHub Actions workflow that:

1. Lints and builds the project
2. Starts a local Supabase instance
3. Runs the full E2E test suite
4. Deploys to Vercel on success
