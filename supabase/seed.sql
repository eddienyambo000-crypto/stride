-- ============================================================
-- STRIDE — seed data (run AFTER schema.sql, in Supabase SQL Editor)
-- Mirrors lib/seed.ts so live mode shows the same demo catalog.
-- Replace with real product data once the client sends it.
-- ============================================================

insert into collections (slug, name, description, sort_order) values
  ('signature',  'Signature Graphics', 'Statement graphic tees — the pieces STRIDE is known for.', 1),
  ('essentials', 'Essentials',          'Everyday heavyweight basics built to last.',               2),
  ('limited',    'Limited Drops',       'Small-run releases. When they''re gone, they''re gone.',    3)
on conflict (slug) do nothing;

insert into delivery_zones (name, fee_rwf, eta, sort_order) values
  ('Kigali',            2000, 'Within 24 hours',  1),
  ('Rwanda-wide',       4500, '2–4 working days', 2),
  ('Pickup (Remera)',      0, 'Ready same day',   3)
on conflict do nothing;

-- Products + a primary image each.
do $$
declare pid uuid;
begin
  insert into products (slug, name, description, price_rwf, price_usd, collection, is_best_seller, stock_status, sizes, colors)
  values ('average-was-never-the-assignment','Average Was Never The Assignment',
    'Heavyweight oversized tee with a neon-charged back graphic. A reminder stitched into cotton: average was never the goal.',
    25000, 19, 'signature', true, 'in_stock', '{S,M,L,XL}', '{Sand,Black}')
  on conflict (slug) do nothing returning id into pid;
  if pid is not null then
    insert into product_images (product_id, url, alt, sort_order)
    values (pid, 'https://placehold.co/900x1100/efe9dd/141210/png?text=AVERAGE+%2F+WAS+NEVER', 'Average Was Never The Assignment tee', 1);
  end if;

  insert into products (slug, name, description, price_rwf, price_usd, collection, is_best_seller, stock_status, sizes, colors)
  values ('uncommon','Uncommon',
    'Bold brushed UNCOMMON front print with electric pink streaks and crown detailing on the sleeves. Oversized fit, premium combed cotton.',
    22000, 17, 'signature', true, 'in_stock', '{S,M,L,XL}', '{Sand,Cream}')
  on conflict (slug) do nothing returning id into pid;
  if pid is not null then
    insert into product_images (product_id, url, alt, sort_order)
    values (pid, 'https://placehold.co/900x1100/efe9dd/141210/png?text=UNCOMMON', 'Uncommon tee', 1);
  end if;

  insert into products (slug, name, description, price_rwf, price_usd, collection, is_best_seller, stock_status, sizes, colors)
  values ('stride-to-conquer-classic-tee','Stride to Conquer — Classic Tee',
    'The signature wordmark, clean and confident. Mid-weight everyday tee in a relaxed cut.',
    18000, 14, 'essentials', true, 'in_stock', '{S,M,L,XL}', '{Black,Cream,Sand}')
  on conflict (slug) do nothing returning id into pid;
  if pid is not null then
    insert into product_images (product_id, url, alt, sort_order)
    values (pid, 'https://placehold.co/900x1100/efe9dd/141210/png?text=STRIDE+%2F+CLASSIC', 'Stride classic tee', 1);
  end if;

  insert into products (slug, name, description, price_rwf, price_usd, collection, is_best_seller, stock_status, sizes, colors)
  values ('conquer-heavyweight-hoodie','Conquer Heavyweight Hoodie',
    '400gsm brushed-back fleece hoodie with embroidered wordmark. Made to order in limited runs.',
    45000, 35, 'essentials', false, 'made_to_order', '{S,M,L,XL}', '{Black,Sand}')
  on conflict (slug) do nothing returning id into pid;
  if pid is not null then
    insert into product_images (product_id, url, alt, sort_order)
    values (pid, 'https://placehold.co/900x1100/efe9dd/141210/png?text=CONQUER+%2F+HOODIE', 'Conquer hoodie', 1);
  end if;

  insert into products (slug, name, description, price_rwf, price_usd, collection, is_best_seller, stock_status, sizes, colors)
  values ('nightfall-graphic-tee','Nightfall Graphic Tee',
    'Midnight-toned back graphic with chromatic glow. Drop-shoulder oversized fit.',
    25000, 19, 'signature', false, 'in_stock', '{S,M,L,XL}', '{Black}')
  on conflict (slug) do nothing returning id into pid;
  if pid is not null then
    insert into product_images (product_id, url, alt, sort_order)
    values (pid, 'https://placehold.co/900x1100/efe9dd/141210/png?text=NIGHTFALL', 'Nightfall graphic tee', 1);
  end if;

  insert into products (slug, name, description, price_rwf, price_usd, collection, is_best_seller, stock_status, sizes, colors)
  values ('heritage-crewneck','Heritage Crewneck',
    'Clean heavyweight crewneck with tonal chest embroidery. Built for the everyday rotation.',
    38000, 29, 'essentials', false, 'in_stock', '{S,M,L,XL}', '{Cream,Black}')
  on conflict (slug) do nothing returning id into pid;
  if pid is not null then
    insert into product_images (product_id, url, alt, sort_order)
    values (pid, 'https://placehold.co/900x1100/efe9dd/141210/png?text=HERITAGE+%2F+CREW', 'Heritage crewneck', 1);
  end if;

  insert into products (slug, name, description, price_rwf, price_usd, collection, is_best_seller, stock_status, sizes, colors)
  values ('pulse-limited-drop','Pulse — Limited Drop',
    'Numbered limited release. Hand-finished print, only 50 made. When it''s gone, it''s gone.',
    30000, 23, 'limited', false, 'made_to_order', '{S,M,L,XL}', '{Sand}')
  on conflict (slug) do nothing returning id into pid;
  if pid is not null then
    insert into product_images (product_id, url, alt, sort_order)
    values (pid, 'https://placehold.co/900x1100/efe9dd/141210/png?text=PULSE+%2F+LIMITED', 'Pulse limited drop tee', 1);
  end if;

  insert into products (slug, name, description, price_rwf, price_usd, collection, is_best_seller, stock_status, sizes, colors)
  values ('momentum-cap','Momentum Cap',
    'Structured 6-panel cap with raised wordmark. One size, adjustable.',
    12000, 9, 'essentials', false, 'in_stock', '{"One Size"}', '{Black,Sand}')
  on conflict (slug) do nothing returning id into pid;
  if pid is not null then
    insert into product_images (product_id, url, alt, sort_order)
    values (pid, 'https://placehold.co/900x1100/efe9dd/141210/png?text=MOMENTUM+%2F+CAP', 'Momentum cap', 1);
  end if;
end $$;
