-- Colonne image sur licenses (si absente)
alter table public.licenses
  add column if not exists photo_url text;

-- Storage → New bucket
-- Nom : license-photos
-- Public : oui
-- Puis coller ceci dans SQL Editor

insert into storage.buckets (id, name, public)
values ('license-photos', 'license-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "license_photos_public_read" on storage.objects;
drop policy if exists "license_photos_auth_write" on storage.objects;

create policy "license_photos_public_read"
on storage.objects for select
to public
using (bucket_id = 'license-photos');

create policy "license_photos_auth_write"
on storage.objects for insert
to authenticated
with check (bucket_id = 'license-photos');
