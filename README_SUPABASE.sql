-- Supabase schema (run in Supabase SQL editor)

-- Users table (optional profile, link to auth.users via user_id)
create table if not exists public.users (
  id bigserial primary key,
  user_id uuid unique, -- supabase auth user id
  account text unique,
  name text,
  created_at timestamptz default now()
);

-- Tips table
create table if not exists public.tips (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete set null,
  amount numeric not null,
  currency text default 'KRW',
  method text,
  reference text,
  created_at timestamptz default now()
);

-- RLS (enable and allow authenticated users to access own rows)
alter table public.tips enable row level security;
create policy tips_select on public.tips
  for select using (auth.uid() = user_id);
create policy tips_insert on public.tips
  for insert with check (auth.uid() = user_id);

