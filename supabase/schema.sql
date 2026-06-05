create extension if not exists pgcrypto;

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  created_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

drop policy if exists "authenticated users can read tasks" on public.tasks;
drop policy if exists "authenticated users can create tasks" on public.tasks;
drop policy if exists "authenticated users can update tasks" on public.tasks;
drop policy if exists "authenticated users can delete tasks" on public.tasks;

create policy "authenticated users can read tasks"
on public.tasks for select
to authenticated
using (true);

create policy "authenticated users can create tasks"
on public.tasks for insert
to authenticated
with check (true);

create policy "authenticated users can update tasks"
on public.tasks for update
to authenticated
using (true)
with check (true);

create policy "authenticated users can delete tasks"
on public.tasks for delete
to authenticated
using (true);
