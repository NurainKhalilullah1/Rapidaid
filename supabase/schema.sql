-- ============================================
-- RapidAid Campus — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- ============================================

-- OPTIONAL: Clean reset (Uncomment the lines below to drop existing tables if schema changes aren't applying)
-- DROP TABLE IF EXISTS public.chat_messages CASCADE;
-- DROP TABLE IF EXISTS public.meals CASCADE;
-- DROP TABLE IF EXISTS public.emergencies CASCADE;
-- DROP TABLE IF EXISTS public.appointments CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. PROFILES TABLE
-- Stores student medical profiles with custom auth (no Supabase Auth)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  password text not null,
  matric_no text not null,
  faculty text not null,
  department text not null,
  blood_group text not null check (blood_group in ('A+','A-','B+','B-','AB+','AB-','O+','O-')),
  genotype text not null check (genotype in ('AA','AS','SS','AC')),
  allergies text[] default '{}',
  medical_history text[] default '{}',
  student_health_id text unique not null,
  registered_at timestamptz default now()
);

-- Simple RLS: allow all operations from anon key (custom auth managed in-app)
alter table public.profiles enable row level security;
drop policy if exists "Allow all profile operations" on public.profiles;
create policy "Allow all profile operations" on public.profiles for all using (true) with check (true);


-- 2. APPOINTMENTS TABLE
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  department text not null check (department in ('General Outpatient','Dental Clinic','Nursing Unit','Pharmacy','Laboratory')),
  date text not null,
  time text not null,
  queue_position integer not null default 1,
  estimated_wait_minutes integer not null default 15,
  status text not null default 'scheduled' check (status in ('scheduled','active','completed','cancelled')),
  created_at timestamptz default now()
);

alter table public.appointments enable row level security;
drop policy if exists "Allow all appointment operations" on public.appointments;
create policy "Allow all appointment operations" on public.appointments for all using (true) with check (true);


-- 3. EMERGENCIES TABLE
create table if not exists public.emergencies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null,
  student_health_id text not null,
  blood_group text not null,
  genotype text not null,
  allergies text[] default '{}',
  medical_history text[] default '{}',
  latitude double precision not null,
  longitude double precision not null,
  status text not null default 'active' check (status in ('active','resolved')),
  timestamp timestamptz default now(),
  fallback_sms_sent boolean default false
);

alter table public.emergencies enable row level security;
drop policy if exists "Allow all emergency operations" on public.emergencies;
create policy "Allow all emergency operations" on public.emergencies for all using (true) with check (true);


-- 4. MEALS TABLE (public read)
create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  local_ingredients text[] default '{}',
  price_range text not null check (price_range in ('Budget','Moderate','Premium')),
  restricted_for text[] default '{}',
  contains_allergens text[] default '{}',
  image_url text default '',
  benefits text not null
);

alter table public.meals enable row level security;
drop policy if exists "Anyone can read meals" on public.meals;
create policy "Anyone can read meals" on public.meals for select using (true);


-- 5. CHAT MESSAGES TABLE
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  thought text,
  timestamp timestamptz default now()
);

alter table public.chat_messages enable row level security;
drop policy if exists "Allow all chat operations" on public.chat_messages;
create policy "Allow all chat operations" on public.chat_messages for all using (true) with check (true);

-- Upgrade existing tables if not doing a clean reset
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS thought text;
