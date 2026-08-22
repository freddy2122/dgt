-- SQL Editor → Run
-- 1) Policies (SELECT + INSERT) pour le rôle authenticated
-- 2) Crée les lignes admin_users manquantes à partir de Authentication → Users

alter table public.admin_users enable row level security;

drop policy if exists "admin_users_insert_own" on public.admin_users;
drop policy if exists "admin_users_select_own" on public.admin_users;

create policy "admin_users_insert_own"
on public.admin_users
for insert
to authenticated
with check (auth_user_id = auth.uid());

create policy "admin_users_select_own"
on public.admin_users
for select
to authenticated
using (auth_user_id = auth.uid());

grant select, insert on table public.admin_users to authenticated;

insert into public.admin_users (auth_user_id, email, name, role, is_active)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data->>'name', 'Admin'),
  'admin',
  true
from auth.users u
where not exists (
  select 1 from public.admin_users a where a.auth_user_id = u.id
);
