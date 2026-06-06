-- MarketLab schema: profiles, markets, positions, ledger_entries

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null default '',
  last_name text not null default '',
  balance_cents bigint not null default 0 check (balance_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.markets (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  status text not null default 'open' check (status in ('open', 'closed', 'resolved')),
  close_date timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  market_id uuid not null references public.markets (id) on delete cascade,
  yes_shares_cents bigint not null default 0 check (yes_shares_cents >= 0),
  no_shares_cents bigint not null default 0 check (no_shares_cents >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, market_id)
);

create table public.ledger_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  market_id uuid references public.markets (id) on delete set null,
  amount_cents bigint not null,
  entry_type text not null,
  description text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Indexes (RLS performance)
-- ---------------------------------------------------------------------------

create index positions_user_id_idx on public.positions (user_id);
create index ledger_entries_user_id_idx on public.ledger_entries (user_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger markets_set_updated_at
before update on public.markets
for each row
execute function public.set_updated_at();

create trigger positions_set_updated_at
before update on public.positions
for each row
execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Profile creation on auth signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  starting_balance_cents bigint := 10000;
begin
  insert into public.profiles (id, first_name, last_name, balance_cents)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    starting_balance_cents
  );

  insert into public.ledger_entries (user_id, market_id, amount_cents, entry_type, description)
  values (
    new.id,
    null,
    starting_balance_cents,
    'signup_bonus',
    'Starting fake balance'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.markets enable row level security;
alter table public.positions enable row level security;
alter table public.ledger_entries enable row level security;

-- Profiles: users read their own row only; no client writes
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

-- Markets: signed-in users can read all market data
create policy "markets_select_authenticated"
on public.markets
for select
to authenticated
using (true);

-- Positions: users read their own rows only; no client writes
create policy "positions_select_own"
on public.positions
for select
to authenticated
using (auth.uid() = user_id);

-- Ledger: users read their own entries only; no client writes
create policy "ledger_entries_select_own"
on public.ledger_entries
for select
to authenticated
using (auth.uid() = user_id);
