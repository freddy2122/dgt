-- SQL Editor → Run
-- Débloque l'INSERT sur points_history (et le SELECT pour l'historique)

alter table public.points_history enable row level security;
alter table public.licenses enable row level security;

alter table public.points_history
  add column if not exists balance_after integer;

drop policy if exists "points_history_select_authenticated" on public.points_history;
drop policy if exists "points_history_insert_authenticated" on public.points_history;
drop policy if exists "licenses_select_authenticated" on public.licenses;
drop policy if exists "licenses_insert_authenticated" on public.licenses;
drop policy if exists "licenses_update_authenticated" on public.licenses;
drop policy if exists "licenses_delete_authenticated" on public.licenses;

create policy "points_history_select_authenticated"
on public.points_history for select
to authenticated
using (true);

create policy "points_history_insert_authenticated"
on public.points_history for insert
to authenticated
with check (true);

create policy "licenses_select_authenticated"
on public.licenses for select
to authenticated
using (true);

create policy "licenses_insert_authenticated"
on public.licenses for insert
to authenticated
with check (true);

create policy "licenses_update_authenticated"
on public.licenses for update
to authenticated
using (true)
with check (true);

create policy "licenses_delete_authenticated"
on public.licenses for delete
to authenticated
using (true);

grant select, insert on table public.points_history to authenticated;
grant select, insert, update, delete on table public.licenses to authenticated;
