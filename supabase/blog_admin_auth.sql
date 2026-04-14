create table if not exists public.admin_emails (
  email text primary key,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.is_blog_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_emails
    where email = auth.jwt() ->> 'email'
  );
$$;

alter table public.blog_posts enable row level security;
alter table public.admin_emails enable row level security;

revoke all on table public.blog_posts from anon, authenticated;
revoke all on table public.admin_emails from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select on table public.blog_posts to anon;
grant select, insert, update, delete on table public.blog_posts to authenticated;
grant select on table public.admin_emails to authenticated;

drop policy if exists "open_blog_posts_access" on public.blog_posts;
drop policy if exists "public_can_read_published_blog_posts" on public.blog_posts;
drop policy if exists "admins_can_read_all_blog_posts" on public.blog_posts;
drop policy if exists "admins_can_insert_blog_posts" on public.blog_posts;
drop policy if exists "admins_can_update_blog_posts" on public.blog_posts;
drop policy if exists "admins_can_delete_blog_posts" on public.blog_posts;

create policy "public_can_read_published_blog_posts"
on public.blog_posts
for select
to anon, authenticated
using (status = 'published');

create policy "admins_can_read_all_blog_posts"
on public.blog_posts
for select
to authenticated
using (public.is_blog_admin());

create policy "admins_can_insert_blog_posts"
on public.blog_posts
for insert
to authenticated
with check (public.is_blog_admin());

create policy "admins_can_update_blog_posts"
on public.blog_posts
for update
to authenticated
using (public.is_blog_admin())
with check (public.is_blog_admin());

create policy "admins_can_delete_blog_posts"
on public.blog_posts
for delete
to authenticated
using (public.is_blog_admin());

drop policy if exists "users_can_check_their_admin_email" on public.admin_emails;

create policy "users_can_check_their_admin_email"
on public.admin_emails
for select
to authenticated
using (email = auth.jwt() ->> 'email');

revoke all on table storage.objects from anon, authenticated;
grant usage on schema storage to anon, authenticated;
grant select on table storage.buckets to anon, authenticated;
grant select on table storage.objects to anon;
grant select, insert, update, delete on table storage.objects to authenticated;

drop policy if exists "open_blog_images_select" on storage.objects;
drop policy if exists "open_blog_images_insert" on storage.objects;
drop policy if exists "open_blog_images_update" on storage.objects;
drop policy if exists "open_blog_images_delete" on storage.objects;
drop policy if exists "public_can_read_blog_images" on storage.objects;
drop policy if exists "admins_can_upload_blog_images" on storage.objects;
drop policy if exists "admins_can_update_blog_images" on storage.objects;
drop policy if exists "admins_can_delete_blog_images" on storage.objects;

create policy "public_can_read_blog_images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'blog-images');

create policy "admins_can_upload_blog_images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'blog-images' and public.is_blog_admin());

create policy "admins_can_update_blog_images"
on storage.objects
for update
to authenticated
using (bucket_id = 'blog-images' and public.is_blog_admin())
with check (bucket_id = 'blog-images' and public.is_blog_admin());

create policy "admins_can_delete_blog_images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'blog-images' and public.is_blog_admin());

insert into public.admin_emails (email)
values ('admin@yourdomain.com')
on conflict (email) do nothing;
