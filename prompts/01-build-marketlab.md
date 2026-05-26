# Build MarketLab With Supabase MCP

You are working in the MarketLab Cursor workshop repo. Turn the static starter into a live fake-money prediction market using Next.js App Router and Supabase.

Before writing code, read the relevant local Next.js 16 docs in `node_modules/next/dist/docs/`, especially App Router Server Components and Server Actions / mutating data. This repo intentionally uses the current Next.js APIs, where `params`, `searchParams`, and `cookies()` are async.

## Product Constraints

- The app is named MarketLab.
- Markets must be fictional and non-political.
- Balances are fake cents. Do not add real payments or financial claims.
- Use email/password auth for the workshop path.
- Use Supabase Auth, Database, Storage, RLS, and RPC through `@supabase/ssr` and `@supabase/supabase-js`.
- Do not add Drizzle, Postgres drivers, Stripe, email, analytics, Sentry, React Hook Form, TanStack Query, or AI SDK dependencies.
- Run project commands through `task` when a task exists.

## Supabase Work

Use Supabase MCP to create migrations and seed data in this repo. Do not rely on dashboard-only SQL changes.

Create the MarketLab schema with:

- `profiles`: one row per auth user, email, display name, fake balance in cents, timestamps, and a signup trigger that gives each user a starter balance of `10000`.
- `markets`: public fictional market questions with title, description, category, close date, creator, optional image path, resolution outcome, and timestamps.
- `trades`: immutable user trade records for YES/NO, amount in fake cents, price snapshot, and timestamp.
- `positions`: owner-scoped aggregate YES/NO stake per user and market.
- `settlements`: owner-scoped claimable payouts created when a market resolves.

Add RLS policies so:

- Public market data is readable.
- Profiles, positions, and settlements are owner-scoped.
- Authenticated users can create markets.
- Balance-changing operations happen through RPC functions, not direct client updates.

Create RPC functions for:

- Executing a trade with auth checks, open-market checks, fake balance debit, trade insert, and position update.
- Resolving a market with creator authorization and settlement creation.
- Claiming a settlement with owner authorization and fake balance credit.

Configure Supabase Storage:

- Bucket: `market-images`.
- Public reads.
- Authenticated uploads for PNG, JPEG, and WebP images.
- 5 MB file limit.
- Users may upload/manage only files inside their own user-id folder.

Seed fictional, non-political demo markets in `supabase/seed.sql` or the generated seed mechanism used by this repo.

## Next.js Work

Wire the static starter into the generated Supabase backend:

- Keep React Server Components by default for pages and data loading.
- Use Server Actions for auth, create market, trade, resolve, and claim mutations.
- Verify authentication and authorization inside every Server Action, even if the UI hides controls.
- Prefer RLS and RPC functions for balance-changing mutations.
- Add a market image upload path backed by the `market-images` bucket.
- Generate Supabase TypeScript types after the schema exists and use them where they improve safety.
- Keep the workshop implementation small, teachable, and aligned with the existing UI.

## Acceptance Checks

Run these after implementation:

```bash
task db:push
task db:types
task verify
task e2e
```

The finished workflow should support:

- Email/password signup and sign-in.
- Starter fake balance of `10000` cents.
- Public market list and market detail pages from Supabase.
- Authenticated market creation with optional image upload.
- Authenticated YES/NO trades using fake cents.
- Creator-only market resolution.
- Claimable fake-money settlement payouts.
