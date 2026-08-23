-- Notes d'examen : inactif par défaut, le client ne voit rien tant que l'admin n'active pas.

alter table public.licenses
  add column if not exists exam_info_active boolean not null default false;

alter table public.licenses
  add column if not exists exam_type text;

alter table public.licenses
  add column if not exists exam_date date;

alter table public.licenses
  add column if not exists exam_grade text;

alter table public.licenses
  add column if not exists exam_errors integer;

comment on column public.licenses.exam_info_active is
  'Si false, aucune nota de examen no se muestra en la consulta pública.';
