-- HVAC Follow-Up Board — table and access rules.
-- Run this first, in the Supabase SQL editor.

create table if not exists public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  customer_name text not null,
  phone text,
  job_type text not null default 'Quote' check (job_type in ('Quote', 'Appointment')),
  job_value numeric(12, 2) not null default 0 check (job_value >= 0),
  stage text not null default 'New'
    check (stage in ('New', 'Contacted', 'Awaiting confirmation', 'Booked')),
  last_contact_at timestamptz not null default now(),
  follow_up_at timestamptz not null default now(),
  notes text
);

create index if not exists follow_ups_stage_idx on public.follow_ups (stage);
create index if not exists follow_ups_follow_up_at_idx on public.follow_ups (follow_up_at);

-- Turn access control on for this table.
alter table public.follow_ups enable row level security;

grant select, insert, update, delete on table public.follow_ups to anon, authenticated;

-- One policy per action. Drop first so this file can be re-run safely.
drop policy if exists "Public read" on public.follow_ups;
drop policy if exists "Public insert" on public.follow_ups;
drop policy if exists "Public update" on public.follow_ups;
drop policy if exists "Public delete" on public.follow_ups;

create policy "Public read"
  on public.follow_ups for select to anon, authenticated using (true);

create policy "Public insert"
  on public.follow_ups for insert to anon, authenticated with check (true);

create policy "Public update"
  on public.follow_ups for update to anon, authenticated using (true) with check (true);

create policy "Public delete"
  on public.follow_ups for delete to anon, authenticated using (true);
