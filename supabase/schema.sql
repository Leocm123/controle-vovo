-- ============================================================
-- Controle Vovô — esquema do banco de dados (Supabase / Postgres)
-- Rode este arquivo no SQL Editor do Supabase (uma única vez).
-- ============================================================

-- Serviços (editáveis: nome + valor por dia + cor)
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  daily_value numeric(10, 2) not null default 0,
  color text not null default '#2563eb',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Um registro = um dia em que um serviço foi prestado
create table if not exists service_entries (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references services(id) on delete cascade,
  entry_date date not null,
  created_at timestamptz not null default now(),
  unique (service_id, entry_date)
);

-- Configurações gerais (linha única)
create table if not exists app_settings (
  id int primary key default 1,
  num_people int not null default 4,
  constraint single_row check (id = 1)
);

-- Dados iniciais
insert into app_settings (id, num_people)
  values (1, 4)
  on conflict (id) do nothing;

insert into services (name, daily_value, color)
  values
    ('Cuidadora', 0, '#2563eb'),
    ('Fisioterapia', 0, '#16a34a')
  on conflict do nothing;

-- ------------------------------------------------------------
-- RLS permissiva (o app não tem login; acesso via anon key).
-- Se um dia quiser adicionar autenticação, ajuste estas políticas.
-- ------------------------------------------------------------
alter table services enable row level security;
alter table service_entries enable row level security;
alter table app_settings enable row level security;

drop policy if exists "public all" on services;
drop policy if exists "public all" on service_entries;
drop policy if exists "public all" on app_settings;

create policy "public all" on services
  for all using (true) with check (true);
create policy "public all" on service_entries
  for all using (true) with check (true);
create policy "public all" on app_settings
  for all using (true) with check (true);
