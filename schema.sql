-- Ndalama v1 schema — run this against your Neon Postgres database
-- psql "$DATABASE_URL" -f schema.sql

create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  business_name text,
  created_at timestamptz not null default now()
);

create type transaction_type as enum ('sale', 'expense', 'credit');
create type transaction_channel as enum ('mobile_money', 'cash', 'bank');
create type credit_status as enum ('open', 'paid');

create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type transaction_type not null,
  channel transaction_channel not null,
  amount numeric(12,2) not null check (amount > 0),
  category text not null default 'other',
  counterparty_name text,
  counterparty_phone text,
  note text,
  -- only meaningful when type = 'credit'
  credit_status credit_status default 'open',
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_transactions_user_created
  on transactions (user_id, created_at desc);

create index if not exists idx_transactions_credit_open
  on transactions (user_id, credit_status)
  where type = 'credit';
