-- ============================================================
-- STRIDE — Supabase schema (run in SQL Editor)
-- Catalog + orders for the COD storefront. Architected so the
-- future Flutterwave online-payment phase needs NO schema change
-- (payment_status flips to 'paid' via webhook instead of on delivery).
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Collections ----------
create table if not exists collections (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  description text,
  sort_order  int not null default 0
);

-- ---------- Delivery zones ----------
create table if not exists delivery_zones (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  fee_rwf     int not null default 0,
  eta         text not null default '',
  sort_order  int not null default 0
);

-- ---------- Products ----------
create table if not exists products (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  name           text not null,
  description    text not null default '',
  price_rwf      int not null,
  price_usd      numeric,
  collection     text not null references collections(slug) on update cascade,
  is_best_seller boolean not null default false,
  stock_status   text not null default 'in_stock'
                   check (stock_status in ('in_stock','made_to_order','sold_out')),
  sizes          text[] not null default '{}',
  colors         text[] not null default '{}',
  created_at     timestamptz not null default now()
);
create index if not exists products_collection_idx on products(collection);

-- ---------- Product images ----------
create table if not exists product_images (
  id         uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url        text not null,
  alt        text,
  sort_order int not null default 0
);
create index if not exists product_images_product_idx on product_images(product_id);

-- ---------- Orders ----------
create table if not exists orders (
  id                 uuid primary key default gen_random_uuid(),
  order_number       text unique not null,
  customer_name      text not null,
  phone              text not null,
  whatsapp           text,
  zone_id            uuid references delivery_zones(id),
  zone_name          text not null default '',
  delivery_address   text not null,
  lat                double precision,
  lng                double precision,
  payment_method     text not null default 'cod'
                       check (payment_method in ('cod','momo_online')),
  payment_status     text not null default 'pending'
                       check (payment_status in ('pending','paid','refunded')),
  fulfillment_status text not null default 'new'
                       check (fulfillment_status in
                         ('new','confirmed','out_for_delivery','delivered','cancelled')),
  subtotal           int not null default 0,
  delivery_fee       int not null default 0,
  total              int not null default 0,
  notes              text,
  created_at         timestamptz not null default now()
);
create index if not exists orders_created_idx on orders(created_at desc);

-- ---------- Order items ----------
create table if not exists order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  product_id uuid,
  name       text not null,
  size       text,
  color      text,
  qty        int not null default 1,
  unit_price int not null default 0
);
create index if not exists order_items_order_idx on order_items(order_id);

-- ============================================================
-- Row Level Security
--  Public: read catalog, insert orders (so checkout works anon).
--  Admin (authenticated): read/update orders + manage catalog.
-- ============================================================
alter table collections    enable row level security;
alter table delivery_zones enable row level security;
alter table products       enable row level security;
alter table product_images enable row level security;
alter table orders         enable row level security;
alter table order_items    enable row level security;

-- Public read on catalog
create policy "public read collections"    on collections    for select using (true);
create policy "public read zones"          on delivery_zones for select using (true);
create policy "public read products"       on products       for select using (true);
create policy "public read product_images" on product_images for select using (true);

-- Public can place orders (insert only); cannot read others' orders
create policy "public insert orders"       on orders         for insert with check (true);
create policy "public insert order_items"  on order_items    for insert with check (true);

-- Authenticated (admin) full access
create policy "auth all orders"      on orders         for all to authenticated using (true) with check (true);
create policy "auth all order_items" on order_items    for all to authenticated using (true) with check (true);
create policy "auth all products"    on products       for all to authenticated using (true) with check (true);
create policy "auth all images"      on product_images for all to authenticated using (true) with check (true);
create policy "auth all collections" on collections    for all to authenticated using (true) with check (true);
create policy "auth all zones"       on delivery_zones for all to authenticated using (true) with check (true);

-- ============================================================
-- Realtime: stream new/updated orders to the admin dashboard
-- ============================================================
alter publication supabase_realtime add table orders;
