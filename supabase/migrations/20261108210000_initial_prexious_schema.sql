-- Prexious Vouge: initial Supabase/Postgres schema
-- Prepared from the last complete application source tree (commit df3e69b).
-- Apply only to the dedicated Prexious Supabase project after confirming the target.
-- Authentication is managed by Supabase Auth; passwords are never stored in public tables.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(btrim(full_name)) between 1 and 120),
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = (select auth.uid())
      and p.role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create or replace function private.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  supplied_name text;
begin
  supplied_name := coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
    split_part(coalesce(new.email, 'customer'), '@', 1)
  );

  insert into public.profiles (id, full_name)
  values (new.id, left(supplied_name, 120))
  on conflict (id) do nothing;

  return new;
end;
$$;

revoke all on function private.handle_new_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_auth_user();

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 180),
  slug text not null unique check (slug ~ '^[a-z0-9]+([a-z0-9-]*[a-z0-9])?$'),
  description text not null,
  price numeric(12,2) not null check (price >= 0),
  currency char(3) not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  category text not null check (char_length(btrim(category)) between 1 and 80),
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_active_created_idx on public.products (is_active, created_at desc);
create index products_category_idx on public.products (category);
create index products_featured_idx on public.products (is_featured) where is_active = true;

create trigger products_set_updated_at
before update on public.products
for each row execute function private.set_updated_at();

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null check (image_url ~ '^https?://'),
  alt_text text,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now()
);

create index product_images_product_position_idx
on public.product_images (product_id, position);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text not null check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  phone text not null check (char_length(regexp_replace(phone, '[^0-9+]', '', 'g')) between 7 and 20),
  outfit_type text not null check (char_length(btrim(outfit_type)) between 1 and 120),
  event_date date not null,
  description text,
  reference_image_url text check (reference_image_url is null or reference_image_url ~ '^https?://'),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookings_status_created_idx on public.bookings (status, created_at desc);
create index bookings_customer_idx on public.bookings (customer_id);

create trigger bookings_set_updated_at
before update on public.bookings
for each row execute function private.set_updated_at();

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  order_number text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  shipping_fee numeric(12,2) not null default 0 check (shipping_fee >= 0),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  currency char(3) not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  shipping_address jsonb not null
    check (
      jsonb_typeof(shipping_address) = 'object'
      and coalesce(shipping_address ->> 'street', '') <> ''
      and coalesce(shipping_address ->> 'city', '') <> ''
      and coalesce(shipping_address ->> 'state', '') <> ''
      and coalesce(shipping_address ->> 'country', '') <> ''
    ),
  customer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint orders_total_matches_subtotal check (total_amount = subtotal + shipping_fee)
);

create index orders_user_created_idx on public.orders (user_id, created_at desc);
create index orders_status_created_idx on public.orders (status, created_at desc);
create index orders_payment_status_idx on public.orders (payment_status);

create trigger orders_set_updated_at
before update on public.orders
for each row execute function private.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_slug text,
  quantity integer not null check (quantity > 0),
  selected_size text,
  selected_color text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) generated always as (unit_price * quantity) stored,
  created_at timestamptz not null default now()
);

create index order_items_order_idx on public.order_items (order_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null default 'paystack' check (provider in ('paystack')),
  reference text not null unique,
  provider_transaction_id text unique,
  amount numeric(12,2) not null check (amount >= 0),
  currency char(3) not null default 'NGN' check (currency ~ '^[A-Z]{3}$'),
  status text not null default 'pending'
    check (status in ('pending', 'success', 'failed', 'abandoned', 'refunded')),
  channel text,
  paid_at timestamptz,
  provider_response jsonb not null default '{}'::jsonb
    check (jsonb_typeof(provider_response) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_order_created_idx on public.payments (order_id, created_at desc);
create index payments_status_created_idx on public.payments (status, created_at desc);

create trigger payments_set_updated_at
before update on public.payments
for each row execute function private.set_updated_at();

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(btrim(comment)) between 1 and 3000),
  image_url text check (image_url is null or image_url ~ '^https?://'),
  is_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_product_approved_created_idx
on public.reviews (product_id, is_approved, created_at desc);
create index reviews_user_idx on public.reviews (user_id);

create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function private.set_updated_at();

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null check (image_url ~ '^https?://'),
  caption text,
  category text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gallery_items_published_position_idx
on public.gallery_items (is_published, position, created_at desc);

create trigger gallery_items_set_updated_at
before update on public.gallery_items
for each row execute function private.set_updated_at();

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  site_name text not null default 'Prexious Vouge',
  brand_title text not null default 'PREXIOUS VOUGE',
  tagline text not null default 'Luxury Fashion Heritage',
  logo_url text,
  favicon_url text,
  hero_title text not null default 'THE PINNACLE OF HIGH-END FASHION',
  hero_subtitle text not null default 'Discover the exclusive collection where tradition meets modernity.',
  hero_image_url text,
  whatsapp_number text check (
    whatsapp_number is null
    or whatsapp_number ~ '^[0-9]{7,15}$'
  ),
  contact_email text,
  address text,
  social_links jsonb not null default '{}'::jsonb
    check (
      jsonb_typeof(social_links) = 'object'
      and (social_links - array['instagram', 'facebook', 'twitter', 'tiktok', 'youtube']) = '{}'::jsonb
    ),
  updated_at timestamptz not null default now()
);

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function private.set_updated_at();

insert into public.site_settings (
  id, site_name, brand_title, tagline, whatsapp_number, social_links
)
values (
  1,
  'Prexious Vouge',
  'PREXIOUS VOUGE',
  'Luxury Fashion Heritage',
  '2348154461869',
  '{"tiktok":"https://www.tiktok.com/@prexiousvouge"}'::jsonb
)
on conflict (id) do nothing;

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 120),
  role text,
  content text not null check (char_length(btrim(content)) between 1 and 3000),
  image_url text check (image_url is null or image_url ~ '^https?://'),
  rating smallint not null default 5 check (rating between 1 and 5),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index testimonials_published_created_idx
on public.testimonials (is_published, created_at desc);

create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function private.set_updated_at();

create table public.page_content (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+([a-z0-9-]*[a-z0-9])?$'),
  title text,
  content text,
  image_url text check (image_url is null or image_url ~ '^https?://'),
  updated_at timestamptz not null default now()
);

create trigger page_content_set_updated_at
before update on public.page_content
for each row execute function private.set_updated_at();

-- Row Level Security: every public table is protected.
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.bookings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.reviews enable row level security;
alter table public.gallery_items enable row level security;
alter table public.site_settings enable row level security;
alter table public.testimonials enable row level security;
alter table public.page_content enable row level security;

-- Profiles: users can see/update only their own non-privileged profile fields.
create policy "profiles_select_own_or_admin"
on public.profiles for select to authenticated
using (id = (select auth.uid()) or (select private.is_admin()));

create policy "profiles_update_own"
on public.profiles for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Products: published products are public; admin can manage all products.
create policy "products_public_read_active"
on public.products for select to anon, authenticated
using (is_active = true);

create policy "products_admin_read_all"
on public.products for select to authenticated
using ((select private.is_admin()));

create policy "products_admin_insert"
on public.products for insert to authenticated
with check ((select private.is_admin()));

create policy "products_admin_update"
on public.products for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "products_admin_delete"
on public.products for delete to authenticated
using ((select private.is_admin()));

create policy "product_images_public_read_active_product"
on public.product_images for select to anon, authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.is_active = true
  )
);

create policy "product_images_admin_read_all"
on public.product_images for select to authenticated
using ((select private.is_admin()));

create policy "product_images_admin_insert"
on public.product_images for insert to authenticated
with check ((select private.is_admin()));

create policy "product_images_admin_update"
on public.product_images for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "product_images_admin_delete"
on public.product_images for delete to authenticated
using ((select private.is_admin()));

-- Bookings: guests may submit pending requests; only admins can inspect/manage all.
create policy "bookings_public_submit_pending"
on public.bookings for insert to anon, authenticated
with check (
  status = 'pending'
  and (customer_id is null or customer_id = (select auth.uid()))
);

create policy "bookings_customer_read_own"
on public.bookings for select to authenticated
using (customer_id = (select auth.uid()));

create policy "bookings_admin_read_all"
on public.bookings for select to authenticated
using ((select private.is_admin()));

create policy "bookings_admin_update"
on public.bookings for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "bookings_admin_delete"
on public.bookings for delete to authenticated
using ((select private.is_admin()));

-- Orders and payments are written only by trusted server-side checkout/payment code.
create policy "orders_customer_read_own"
on public.orders for select to authenticated
using (user_id = (select auth.uid()));

create policy "orders_admin_read_all"
on public.orders for select to authenticated
using ((select private.is_admin()));

create policy "orders_admin_update_fulfilment"
on public.orders for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "order_items_customer_read_own_order"
on public.order_items for select to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = (select auth.uid())
  )
);

create policy "order_items_admin_read_all"
on public.order_items for select to authenticated
using ((select private.is_admin()));

create policy "payments_customer_read_own_order"
on public.payments for select to authenticated
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = (select auth.uid())
  )
);

create policy "payments_admin_read_all"
on public.payments for select to authenticated
using ((select private.is_admin()));

-- Reviews: public can read approved reviews; customers can submit/manage only their own unapproved review.
create policy "reviews_public_read_approved"
on public.reviews for select to anon, authenticated
using (is_approved = true);

create policy "reviews_customer_read_own"
on public.reviews for select to authenticated
using (user_id = (select auth.uid()));

create policy "reviews_admin_read_all"
on public.reviews for select to authenticated
using ((select private.is_admin()));

create policy "reviews_customer_insert_unapproved"
on public.reviews for insert to authenticated
with check (
  user_id = (select auth.uid())
  and is_approved = false
);

create policy "reviews_customer_update_own_unapproved"
on public.reviews for update to authenticated
using (user_id = (select auth.uid()) and is_approved = false)
with check (user_id = (select auth.uid()) and is_approved = false);

create policy "reviews_customer_delete_own_unapproved"
on public.reviews for delete to authenticated
using (user_id = (select auth.uid()) and is_approved = false);

create policy "reviews_admin_update"
on public.reviews for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "reviews_admin_delete"
on public.reviews for delete to authenticated
using ((select private.is_admin()));

-- Public content is readable; only admins can change it.
create policy "gallery_public_read_published"
on public.gallery_items for select to anon, authenticated
using (is_published = true);

create policy "gallery_admin_read_all"
on public.gallery_items for select to authenticated
using ((select private.is_admin()));

create policy "gallery_admin_insert"
on public.gallery_items for insert to authenticated
with check ((select private.is_admin()));

create policy "gallery_admin_update"
on public.gallery_items for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "gallery_admin_delete"
on public.gallery_items for delete to authenticated
using ((select private.is_admin()));

create policy "site_settings_public_read"
on public.site_settings for select to anon, authenticated
using (true);

create policy "site_settings_admin_update"
on public.site_settings for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "testimonials_public_read_published"
on public.testimonials for select to anon, authenticated
using (is_published = true);

create policy "testimonials_admin_read_all"
on public.testimonials for select to authenticated
using ((select private.is_admin()));

create policy "testimonials_admin_insert"
on public.testimonials for insert to authenticated
with check ((select private.is_admin()));

create policy "testimonials_admin_update"
on public.testimonials for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "testimonials_admin_delete"
on public.testimonials for delete to authenticated
using ((select private.is_admin()));

create policy "page_content_public_read"
on public.page_content for select to anon, authenticated
using (true);

create policy "page_content_admin_insert"
on public.page_content for insert to authenticated
with check ((select private.is_admin()));

create policy "page_content_admin_update"
on public.page_content for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

create policy "page_content_admin_delete"
on public.page_content for delete to authenticated
using ((select private.is_admin()));

-- Explicit Data API grants are required for new public-schema tables on current Supabase projects.
grant usage on schema public to anon, authenticated;

grant select on
  public.products,
  public.product_images,
  public.site_settings,
  public.gallery_items,
  public.testimonials,
  public.page_content
to anon, authenticated;

grant select on public.profiles to authenticated;
grant update (full_name, phone, avatar_url) on public.profiles to authenticated;

grant insert on public.bookings to anon, authenticated;
grant select, update, delete on public.bookings to authenticated;

grant select on public.orders, public.order_items, public.payments to authenticated;
grant update (status, customer_note) on public.orders to authenticated;

grant select on public.reviews to anon, authenticated;
grant insert, update, delete on public.reviews to authenticated;

grant insert, update, delete on
  public.products,
  public.product_images,
  public.gallery_items,
  public.testimonials,
  public.page_content
to authenticated;

grant update on public.site_settings to authenticated;

-- Public product/media bucket. Admin-only writes are enforced by Storage RLS.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'prexious-public',
  'prexious-public',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "prexious_assets_public_read"
on storage.objects for select to anon, authenticated
using (bucket_id = 'prexious-public');

create policy "prexious_assets_admin_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'prexious-public'
  and (select private.is_admin())
);

create policy "prexious_assets_admin_update"
on storage.objects for update to authenticated
using (
  bucket_id = 'prexious-public'
  and (select private.is_admin())
)
with check (
  bucket_id = 'prexious-public'
  and (select private.is_admin())
);

create policy "prexious_assets_admin_delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'prexious-public'
  and (select private.is_admin())
);

-- IMPORTANT:
-- 1. Create the first admin account through Supabase Auth, then promote it manually:
--    update public.profiles set role = 'admin' where id = '<AUTH_USER_UUID>';
-- 2. Do not expose service_role / secret keys in frontend environment variables.
-- 3. Create orders, order_items and payments only from a trusted server/Edge Function.
-- 4. Verify Paystack server-side, recalculate totals from database prices, and use
--    a database transaction/RPC to reserve stock and mark payment exactly once.
-- 5. Migrate MongoDB data with an explicit ObjectId -> UUID mapping; do not copy
--    hashed Mongo passwords into profiles. Users must reset/set passwords in Auth.
