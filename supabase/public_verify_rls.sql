-- Lecture publique pour /verificar-permiso (rôle anon)

drop policy if exists "licenses_select_anon" on public.licenses;
drop policy if exists "points_history_select_anon" on public.points_history;

create policy "licenses_select_anon"
on public.licenses for select
to anon
using (true);

create policy "points_history_select_anon"
on public.points_history for select
to anon
using (true);

grant select on table public.licenses to anon;
grant select on table public.points_history to anon;
