-- Sima Tech CRM · esquema inicial
-- Pegar completo en Supabase → SQL Editor → Run. Es idempotente en las tablas.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text not null default '',
  owner text not null,
  due text not null default '',
  priority text not null check (priority in ('alta', 'media', 'baja')),
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.kanban_cards (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text not null default '',
  "column" text not null check ("column" in ('idea', 'curso', 'revision', 'hecho')),
  progress int not null default 0 check (progress between 0 and 100),
  owner text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  day int not null check (day between 1 and 31),
  month int not null check (month between 0 and 11), -- igual que Date.getMonth()
  year int not null,
  time text not null default '09:00',
  title text not null,
  kind text not null check (kind in ('lanzamiento', 'contenido', 'reunion', 'campana', 'entrega')),
  created_at timestamptz not null default now()
);

-- Seguridad a nivel de fila ------------------------------------------------
alter table public.tasks enable row level security;
alter table public.kanban_cards enable row level security;
alter table public.calendar_events enable row level security;

-- ACCESO ABIERTO TEMPORAL: cualquiera con la publishable key puede leer y
-- escribir. Aceptable solo mientras no haya login. Al activar Supabase Auth,
-- borrar estas políticas y reemplazar `anon` por `authenticated`.
create policy "open_all_tasks" on public.tasks
  for all to anon, authenticated using (true) with check (true);
create policy "open_all_cards" on public.kanban_cards
  for all to anon, authenticated using (true) with check (true);
create policy "open_all_events" on public.calendar_events
  for all to anon, authenticated using (true) with check (true);

-- Datos iniciales (solo si las tablas están vacías) ------------------------
insert into public.tasks (title, detail, owner, due, priority, done)
select * from (values
  ('Aprobar copy del embudo «Señal»', 'Revisar 3 variantes de subject y CTA con el equipo de growth.', 'Elena', 'Hoy · 17:00', 'alta', false),
  ('Cerrar brief de la campaña Q3', 'Definir audiencias, presupuesto y KPIs por canal.', 'Juan', 'Mañana', 'alta', false),
  ('Auditar velocidad de la landing', 'Objetivo: LCP < 2.0s en móvil.', 'Mateo', 'Jueves', 'media', false),
  ('Actualizar manual de marca', 'Incorporar la paleta ámbar y las nuevas reglas tonales.', 'Lucía', 'Viernes', 'media', false),
  ('Configurar alertas de atribución', 'Slack #growth con alertas de CAC semanal.', 'Sofía', 'Lunes', 'baja', false),
  ('Enviar informe de julio', 'Informe ejecutivo con 3 insights y 1 recomendación.', 'Juan', 'Completado', 'media', true)
) as v(title, detail, owner, due, priority, done)
where not exists (select 1 from public.tasks);

insert into public.kanban_cards (title, tag, "column", progress, owner)
select * from (values
  ('Serie de videos «Señal»', 'Contenido', 'idea', 10, 'Lucía'),
  ('Rebrand del dashboard de cliente', 'Producto', 'idea', 0, 'Mateo'),
  ('Optimizar formulario de demo', 'CRO', 'curso', 65, 'Elena'),
  ('Secuencia de email · 5 pasos', 'CRM', 'curso', 40, 'Sofía'),
  ('Landing de la campaña Q3', 'Web', 'revision', 85, 'Mateo'),
  ('Guía de tono de marca', 'Marca', 'hecho', 100, 'Juan')
) as v(title, tag, "column", progress, owner)
where not exists (select 1 from public.kanban_cards);

-- Eventos relativos a la fecha de ejecución, dentro del mes en curso.
insert into public.calendar_events (day, month, year, time, title, kind)
select extract(day from d)::int, extract(month from d)::int - 1, extract(year from d)::int, t, title, kind
from (values
  (current_date + 1, '09:30', 'Kickoff campaña Q3', 'campana'),
  (current_date + 2, '11:00', 'Revisión de creatividades', 'reunion'),
  (current_date + 4, '16:00', 'Lanzamiento landing «Señal»', 'lanzamiento'),
  (current_date + 6, '10:00', 'Newsletter mensual', 'contenido'),
  (current_date + 9, '18:00', 'Entrega informe de resultados', 'entrega'),
  (current_date - 3, '12:00', 'Workshop de marca', 'reunion')
) as v(d, t, title, kind)
where not exists (select 1 from public.calendar_events);
