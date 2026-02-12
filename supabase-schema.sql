-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Tasks table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('urgent', 'high', 'medium', 'low')),
  due_date timestamptz,
  column_id text not null default 'todo' check (column_id in ('todo', 'in-progress', 'completed')),
  "order" integer not null default 0,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Todos table
create table public.todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  completed boolean default false not null,
  created_at timestamptz default now() not null
);

-- Notes table
create table public.notes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null default '',
  content text not null default '',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable Row Level Security
alter table public.tasks enable row level security;
alter table public.todos enable row level security;
alter table public.notes enable row level security;

-- RLS Policies: Users can only access their own data
create policy "Users can view own tasks" on public.tasks for select using (auth.uid() = user_id);
create policy "Users can insert own tasks" on public.tasks for insert with check (auth.uid() = user_id);
create policy "Users can update own tasks" on public.tasks for update using (auth.uid() = user_id);
create policy "Users can delete own tasks" on public.tasks for delete using (auth.uid() = user_id);

create policy "Users can view own todos" on public.todos for select using (auth.uid() = user_id);
create policy "Users can insert own todos" on public.todos for insert with check (auth.uid() = user_id);
create policy "Users can update own todos" on public.todos for update using (auth.uid() = user_id);
create policy "Users can delete own todos" on public.todos for delete using (auth.uid() = user_id);

create policy "Users can view own notes" on public.notes for select using (auth.uid() = user_id);
create policy "Users can insert own notes" on public.notes for insert with check (auth.uid() = user_id);
create policy "Users can update own notes" on public.notes for update using (auth.uid() = user_id);
create policy "Users can delete own notes" on public.notes for delete using (auth.uid() = user_id);
