create extension if not exists pgcrypto;

create table if not exists public.conversations (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    emotion text,
    preview text,
    created_at timestamptz not null default now()
);

create table if not exists public.messages (
    id uuid primary key default gen_random_uuid(),
    conversation_id uuid not null references public.conversations(id) on delete cascade,
    sender text not null check (sender in ('user', 'ai')),
    content text not null,
    emotion text,
    created_at timestamptz not null default now()
);

create table if not exists public.mood_entries (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    mood text not null,
    emoji text not null,
    note text,
    created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.mood_entries enable row level security;

drop policy if exists "Users can read own conversations" on public.conversations;
create policy "Users can read own conversations"
on public.conversations for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own conversations" on public.conversations;
create policy "Users can insert own conversations"
on public.conversations for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own conversations" on public.conversations;
create policy "Users can update own conversations"
on public.conversations for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own conversations" on public.conversations;
create policy "Users can delete own conversations"
on public.conversations for delete
using (auth.uid() = user_id);

drop policy if exists "Users can read own messages" on public.messages;
create policy "Users can read own messages"
on public.messages for select
using (
    exists (
        select 1
        from public.conversations c
        where c.id = conversation_id
          and c.user_id = auth.uid()
    )
);

drop policy if exists "Users can insert own messages" on public.messages;
create policy "Users can insert own messages"
on public.messages for insert
with check (
    exists (
        select 1
        from public.conversations c
        where c.id = conversation_id
          and c.user_id = auth.uid()
    )
);

drop policy if exists "Users can update own messages" on public.messages;
create policy "Users can update own messages"
on public.messages for update
using (
    exists (
        select 1
        from public.conversations c
        where c.id = conversation_id
          and c.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.conversations c
        where c.id = conversation_id
          and c.user_id = auth.uid()
    )
);

drop policy if exists "Users can delete own messages" on public.messages;
create policy "Users can delete own messages"
on public.messages for delete
using (
    exists (
        select 1
        from public.conversations c
        where c.id = conversation_id
          and c.user_id = auth.uid()
    )
);

drop policy if exists "Users can read own mood entries" on public.mood_entries;
create policy "Users can read own mood entries"
on public.mood_entries for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own mood entries" on public.mood_entries;
create policy "Users can insert own mood entries"
on public.mood_entries for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own mood entries" on public.mood_entries;
create policy "Users can update own mood entries"
on public.mood_entries for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own mood entries" on public.mood_entries;
create policy "Users can delete own mood entries"
on public.mood_entries for delete
using (auth.uid() = user_id);
