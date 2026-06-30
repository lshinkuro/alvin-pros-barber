-- Barber Academy — Supabase schema, RLS, triggers, and seed data.
-- Run this in the Supabase SQL editor (once per project).

-- ============================================================================
-- Extensions
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- profiles
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- courses
-- ============================================================================
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null default '',
  price numeric(10, 2) not null default 0,
  cover_image text,
  preview_images text[] default '{}'::text[],
  pdf_path text,
  modules text[] default '{}'::text[],
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- orders
-- ============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  status text not null default 'waiting' check (status in ('waiting', 'completed', 'rejected')),
  pdf_password text,
  download_token text,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists orders_status_idx on public.orders(status);

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.orders enable row level security;

-- profiles
drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert" on public.profiles
  for insert with check (auth.uid() = id);

-- courses: anyone can read published, only admins can write
drop policy if exists "courses public read" on public.courses;
create policy "courses public read" on public.courses
  for select using (is_published = true);

drop policy if exists "courses admin all" on public.courses;
create policy "courses admin all" on public.courses
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- orders: user reads own, inserts own, never updates sensitive cols (we use service role)
drop policy if exists "orders self read" on public.orders;
create policy "orders self read" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "orders self insert" on public.orders;
create policy "orders self insert" on public.orders
  for insert with check (auth.uid() = user_id);

drop policy if exists "orders admin all" on public.orders;
create policy "orders admin all" on public.orders
  for all using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ============================================================================
-- Seed catalog
-- ============================================================================
insert into public.courses (slug, title, description, price, modules)
values
  ('haircut-fundamentals', 'Haircut Fundamentals',
   'The foundation of every great barber. Master your tools, posture, sectioning, guide lines, and the universal language every haircut starts from.',
   49, array['Tools & sanitation','Posture & ergonomics','Sectioning & guide lines','Universal cutting language','First haircut walkthrough']),
  ('fade-techniques', 'Fade Techniques',
   'Low, mid, high, skin and burst fades — clipper-over-comb, lever control, and seamless blending. Step-by-step photography on every hair type.',
   69, array['Clipper anatomy & lever control','Low / mid / high fades','Skin & burst fades','Blending on every hair type','Fixing common fade mistakes']),
  ('scissor-cutting', 'Scissor Cutting',
   'Point cutting, slide cutting, texturizing, and the editorial scissor-only haircut.',
   59, array['Scissor anatomy & grip','Point & slide cutting','Texturizing & weight removal','Scissor-only haircut','Editorial finishing']),
  ('beard-styling', 'Beard Styling',
   'Face shape mapping, line work, the perfect hot-towel shave routine, and ongoing beard maintenance plans for clients.',
   49, array['Face shape mapping','Outline & line work','Hot-towel shave routine','Beard maintenance plans']),
  ('hair-coloring', 'Hair Coloring',
   'Color theory, foundation tones, lifts, toners, and the safest path from natural shades into fashion color.',
   79, array['Color theory','Foundation tones & lifts','Toners & glosses','Fashion color safely']),
  ('barber-business', 'Barber Business',
   'Pricing, booking, retention, social content and turning your chair into a real brand.',
   89, array['Pricing & packaging','Booking & no-show defense','Retention systems','Social content engine','Brand & shop economics']),
  ('customer-service', 'Customer Service',
   'Consultations, difficult conversations, recovery from mistakes, and lifetime clients.',
   39, array['Consultation framework','Handling difficult conversations','Recovering from mistakes','Lifetime client systems'])
on conflict (slug) do nothing;

-- ============================================================================
-- Storage bucket (private) for protected PDFs
-- Run this once. The bucket is private; the admin server creates signed URLs.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('course-pdfs', 'course-pdfs', false)
on conflict (id) do nothing;

-- Only admins can read/write directly to storage; signed URLs handle delivery.
drop policy if exists "course-pdfs admin select" on storage.objects;
create policy "course-pdfs admin select" on storage.objects
  for select using (
    bucket_id = 'course-pdfs'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "course-pdfs admin write" on storage.objects;
create policy "course-pdfs admin write" on storage.objects
  for all using (
    bucket_id = 'course-pdfs'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  ) with check (
    bucket_id = 'course-pdfs'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );
