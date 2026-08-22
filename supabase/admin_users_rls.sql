-- À coller dans Supabase → SQL Editor → Run
-- Corrige le 403 sur POST /rest/v1/admin_users

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
