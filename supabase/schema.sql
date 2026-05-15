-- DevisPro AI - Schema MVP
-- Postgres 15 / Supabase

create extension if not exists "pgcrypto";

create type public.quote_status as enum ('draft', 'sent', 'accepted', 'rejected', 'expired', 'invoiced');
create type public.invoice_status as enum ('draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled');
create type public.reminder_type as enum ('quote_followup', 'payment_followup');
create type public.reminder_status as enum ('queued', 'sent', 'failed', 'cancelled');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  siret text,
  vat_number text,
  phone text,
  email text,
  address text,
  city text,
  postal_code text,
  country text default 'FR',
  logo_url text,
  default_hourly_rate numeric(10,2) not null default 45,
  default_margin_rate numeric(5,4) not null default 0.20,
  created_at timestamptz not null default now()
);

create table if not exists public.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  unique(company_id, user_id)
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  type text not null default 'particulier',
  full_name text not null,
  email text,
  phone text,
  address text,
  city text,
  postal_code text,
  country text default 'FR',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  location text,
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  quote_number text not null,
  status public.quote_status not null default 'draft',
  title text not null,
  scope text,
  subtotal_ht numeric(12,2) not null default 0,
  margin_amount numeric(12,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total_ttc numeric(12,2) not null default 0,
  labor_hours numeric(10,2) not null default 0,
  valid_until date,
  signed_at timestamptz,
  signature_url text,
  ai_prompt text,
  ai_response jsonb,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id, quote_number)
);

create table if not exists public.quote_lines (
  id uuid primary key default gen_random_uuid(),
  quote_id uuid not null references public.quotes(id) on delete cascade,
  position int not null default 1,
  category text not null,
  label text not null,
  description text,
  quantity numeric(12,3) not null default 1,
  unit text not null default 'u',
  unit_price_ht numeric(12,2) not null default 0,
  vat_rate numeric(5,4) not null default 0.2,
  total_ht numeric(12,2) not null default 0
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete set null,
  invoice_number text not null,
  status public.invoice_status not null default 'draft',
  issue_date date not null default current_date,
  due_date date,
  subtotal_ht numeric(12,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total_ttc numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  balance_due numeric(12,2) not null default 0,
  pdf_url text,
  created_at timestamptz not null default now(),
  unique(company_id, invoice_number)
);

create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  position int not null default 1,
  label text not null,
  quantity numeric(12,3) not null default 1,
  unit text not null default 'u',
  unit_price_ht numeric(12,2) not null default 0,
  vat_rate numeric(5,4) not null default 0.2,
  total_ht numeric(12,2) not null default 0
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  provider text not null default 'manual',
  provider_payment_id text,
  amount numeric(12,2) not null,
  currency text not null default 'EUR',
  status text not null default 'succeeded',
  paid_at timestamptz not null default now(),
  metadata jsonb
);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  quote_id uuid references public.quotes(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  type public.reminder_type not null,
  status public.reminder_status not null default 'queued',
  channel text not null default 'email',
  scheduled_at timestamptz not null,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.price_library (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  code text not null,
  label text not null,
  category text not null,
  unit text not null,
  unit_price_ht numeric(12,2) not null,
  vat_rate numeric(5,4) not null default 0.2,
  region text not null default 'fr_standard',
  supplier_name text,
  product_url text,
  image_url text,
  source_updated_at date,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.price_library add column if not exists supplier_name text;
alter table public.price_library add column if not exists product_url text;
alter table public.price_library add column if not exists image_url text;
alter table public.price_library add column if not exists source_updated_at date;

create table if not exists public.document_templates (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  type text not null check (type in ('quote', 'invoice', 'reminder_email')),
  name text not null,
  content jsonb not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_clients_company_id on public.clients(company_id);
create index if not exists idx_quotes_company_id on public.quotes(company_id);
create index if not exists idx_quotes_status on public.quotes(status);
create index if not exists idx_invoices_company_id on public.invoices(company_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_reminders_status_scheduled on public.reminders(status, scheduled_at);
create index if not exists idx_price_library_company_region_active on public.price_library(company_id, region, is_active);
create unique index if not exists uq_price_library_company_code_region_active
on public.price_library(company_id, code, region)
where is_active = true;

alter table public.profiles enable row level security;
alter table public.companies enable row level security;
alter table public.company_members enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.quotes enable row level security;
alter table public.quote_lines enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;
alter table public.payments enable row level security;
alter table public.reminders enable row level security;
alter table public.price_library enable row level security;
alter table public.document_templates enable row level security;

create policy "member_read_companies" on public.companies
for select using (
  exists (
    select 1 from public.company_members m
    where m.company_id = companies.id and m.user_id = auth.uid()
  )
  or owner_id = auth.uid()
);

create policy "owner_update_companies" on public.companies
for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "member_access_clients" on public.clients
for all using (
  exists (
    select 1 from public.company_members m
    where m.company_id = clients.company_id and m.user_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.company_members m
    where m.company_id = clients.company_id and m.user_id = auth.uid()
  )
);

create policy "company_members_select_self" on public.company_members
for select using (user_id = auth.uid());

create policy "company_members_insert_self" on public.company_members
for insert with check (user_id = auth.uid());

create policy "company_members_delete_self" on public.company_members
for delete using (user_id = auth.uid());

create policy "member_access_price_library" on public.price_library
for select using (
  exists (
    select 1 from public.company_members m
    where m.company_id = price_library.company_id and m.user_id = auth.uid()
  )
  or exists (
    select 1 from public.companies c
    where c.id = price_library.company_id and c.owner_id = auth.uid()
  )
);

create policy "member_insert_price_library" on public.price_library
for insert with check (
  exists (
    select 1 from public.company_members m
    where m.company_id = price_library.company_id and m.user_id = auth.uid()
  )
  or exists (
    select 1 from public.companies c
    where c.id = price_library.company_id and c.owner_id = auth.uid()
  )
);

create policy "member_update_price_library" on public.price_library
for update using (
  exists (
    select 1 from public.company_members m
    where m.company_id = price_library.company_id and m.user_id = auth.uid()
  )
  or exists (
    select 1 from public.companies c
    where c.id = price_library.company_id and c.owner_id = auth.uid()
  )
) with check (
  exists (
    select 1 from public.company_members m
    where m.company_id = price_library.company_id and m.user_id = auth.uid()
  )
  or exists (
    select 1 from public.companies c
    where c.id = price_library.company_id and c.owner_id = auth.uid()
  )
);

create policy "member_delete_price_library" on public.price_library
for delete using (
  exists (
    select 1 from public.company_members m
    where m.company_id = price_library.company_id and m.user_id = auth.uid()
  )
  or exists (
    select 1 from public.companies c
    where c.id = price_library.company_id and c.owner_id = auth.uid()
  )
);
