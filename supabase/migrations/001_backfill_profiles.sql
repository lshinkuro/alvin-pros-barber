-- Idempotent migration: re-install the profile auto-creation trigger and
-- backfill missing rows for existing auth users.
--
-- Run this in the Supabase SQL editor. Safe to run multiple times.

-- 1. Recreate the trigger function (SECURITY DEFINER so it bypasses RLS).
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

-- 2. Re-attach the trigger to auth.users.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Backfill: create a profile row for every existing auth user that is
--    missing one. This fixes anyone who signed up before the trigger existed.
insert into public.profiles (id, name, email)
select
  u.id,
  coalesce(u.raw_user_meta_data->>'name', split_part(u.email, '@', 1)),
  u.email
from auth.users u
where not exists (
  select 1 from public.profiles p where p.id = u.id
);
