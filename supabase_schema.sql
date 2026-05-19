-- SUPABASE SCHEMA FOR ADVOCATES IPHONES

-- 1. Products table
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  price numeric not null,
  compare_at_price numeric,
  stock integer default 0,
  condition text check (condition in ('new', 'refurbished', 'pre-owned')),
  storage text,
  color text,
  color_hex text,
  images text[],
  warranty_months integer default 12,
  battery_health integer,
  category text,
  active boolean default true,
  featured boolean default false,
  created_at timestamp with time zone default now()
);

-- 2. Orders table
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  phone text not null,
  email text,
  delivery_address text not null,
  payment_method text check (payment_method in ('whatsapp', 'eft', 'cod')),
  status text check (status in ('pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled')) default 'pending',
  subtotal numeric not null,
  delivery_fee numeric default 0,
  total numeric not null,
  notes text,
  created_at timestamp with time zone default now()
);

-- 3. Order items table
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric not null,
  selected_variant text,
  created_at timestamp with time zone default now()
);

-- 4. Function to decrement stock
create or replace function decrement_stock(product_id uuid, count integer)
returns void as $$
begin
  update products
  set stock = stock - count
  where id = product_id;
end;
$$ language plpgsql;

-- 5. Row Level Security (RLS)
-- Products: Read for everyone, Write for authenticated users (admins)
alter table products enable row level security;
create policy "Products are viewable by everyone" on products for select using (true);
create policy "Only admins can modify products" on products for all using (auth.role() = 'authenticated');

-- Orders: Write for everyone (checkout), Read/Write for authenticated users (admins)
alter table orders enable row level security;
create policy "Anyone can create an order" on orders for insert with check (true);
create policy "Only admins can view/modify orders" on orders for all using (auth.role() = 'authenticated');

-- Order Items: Write for everyone (checkout), Read/Write for authenticated users (admins)
alter table order_items enable row level security;
create policy "Anyone can create order items" on order_items for insert with check (true);
create policy "Only admins can view/modify order items" on order_items for all using (auth.role() = 'authenticated');

-- 6. Insert sample products
insert into products (name, slug, price, stock, condition, storage, color, color_hex, images, warranty_months, category, featured) values
  ('iPhone 15 Pro', 'iphone-15-pro', 24999, 5, 'new', '256GB', 'Natural Titanium', '#9A9A9A', '{}', 24, 'iPhone 15', true),
  ('iPhone 15 Pro', 'iphone-15-pro-512', 27999, 3, 'new', '512GB', 'Black Titanium', '#3D3D3D', '{}', 24, 'iPhone 15', false),
  ('iPhone 15', 'iphone-15', 17999, 8, 'new', '128GB', 'Pink', '#F8C8DC', '{}', 24, 'iPhone 15', true),
  ('iPhone 14 Pro', 'iphone-14-pro', 19999, 4, 'refurbished', '128GB', 'Deep Purple', '#592F5B', '{}', 12, 'iPhone 14', true),
  ('iPhone 14', 'iphone-14', 13999, 6, 'refurbished', '256GB', 'Blue', '#A3C4E8', '{}', 12, 'iPhone 14', false),
  ('iPhone 13', 'iphone-13', 10999, 10, 'refurbished', '128GB', 'Midnight', '#2D2D3A', '{}', 6, 'iPhone 13', false);
