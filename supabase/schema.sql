-- ============================================================
-- Joungna News (HN 스타일 게시판) DB 스키마
-- Supabase MCP 또는 SQL Editor에서 실행
-- ============================================================

-- 1. 프로필 (auth.users 1:1)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null check (char_length(username) between 2 and 20),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_all" on public.profiles
  for select using (true);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- 회원가입 시 프로필 자동 생성 트리거
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(
      nullif(trim(new.raw_user_meta_data->>'username'), ''),
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. 게시글
create table public.posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  url text,
  content text,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

create policy "posts_select_all" on public.posts
  for select using (true);
create policy "posts_insert_own" on public.posts
  for insert with check (auth.uid() = author_id);
create policy "posts_update_own" on public.posts
  for update using (auth.uid() = author_id);
create policy "posts_delete_own" on public.posts
  for delete using (auth.uid() = author_id);

-- 3. 댓글
create table public.comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

create policy "comments_select_all" on public.comments
  for select using (true);
create policy "comments_insert_own" on public.comments
  for insert with check (auth.uid() = author_id);
create policy "comments_delete_own" on public.comments
  for delete using (auth.uid() = author_id);

-- 4. 좋아요/싫어요 (value: 1 = 좋아요, -1 = 싫어요)
create table public.votes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  post_id bigint not null references public.posts(id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

alter table public.votes enable row level security;

create policy "votes_select_all" on public.votes
  for select using (true);
create policy "votes_insert_own" on public.votes
  for insert with check (auth.uid() = user_id);
create policy "votes_update_own" on public.votes
  for update using (auth.uid() = user_id);
create policy "votes_delete_own" on public.votes
  for delete using (auth.uid() = user_id);

-- 5. 목록 조회용 뷰 (점수, 댓글 수, 작성자 닉네임 포함)
--    security_invoker = true : 조회하는 사용자의 RLS 권한으로 실행
create view public.posts_with_meta
with (security_invoker = true) as
select
  p.id,
  p.author_id,
  p.title,
  p.url,
  p.content,
  p.created_at,
  pr.username,
  coalesce((select sum(v.value)::int from public.votes v where v.post_id = p.id), 0) as score,
  (select count(*)::int from public.comments c where c.post_id = p.id) as comment_count
from public.posts p
join public.profiles pr on pr.id = p.author_id;

-- 6. 인덱스
create index idx_posts_created_at on public.posts (created_at desc);
create index idx_comments_post_id on public.comments (post_id);
create index idx_votes_post_id on public.votes (post_id);
