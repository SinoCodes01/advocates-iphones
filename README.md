# Advocates iPhones — Ecommerce MVP

A premium ecommerce website for selling iPhones and accessories. Built with **Next.js 14**, **Tailwind CSS**, **shadcn/ui**, and **Supabase**.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Backend | Supabase (Postgres, Auth, Storage) |
| State | React Context + Zustand |
| Icons | Lucide React |

## Features (Phase 1 MVP)

- [x] Homepage with hero, featured products, trust badges
- [x] Product catalog with search & filters
- [x] Product detail page with variants, gallery, specs
- [x] Cart with quantity management
- [x] Guest checkout with order confirmation
- [x] WhatsApp order handoff
- [x] Admin dashboard (product & order management)
- [x] Responsive mobile-first design

## Getting Started

### 1. Install dependencies

```bash
cd advocates-iphones
npm install
```

### 2. Configure environment

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WHATSAPP_NUMBER=27612345678
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Set up Supabase

Run the SQL below in your Supabase SQL Editor to create the required tables:

```sql
-- Products table
create table products (
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

-- Orders table
create table orders (
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

-- Order items table
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  quantity integer not null default 1,
  unit_price numeric not null,
  created_at timestamp with time zone default now()
);

-- Insert sample products
insert into products (name, slug, price, stock, condition, storage, color, color_hex, images, warranty_months, category, featured) values
  ('iPhone 15 Pro', 'iphone-15-pro', 24999, 5, 'new', '256GB', 'Natural Titanium', '#9A9A9A', '[]', 24, 'iphone-15', true),
  ('iPhone 15 Pro', 'iphone-15-pro-512', 27999, 3, 'new', '512GB', 'Black Titanium', '#3D3D3D', '[]', 24, 'iphone-15', false),
  ('iPhone 15', 'iphone-15', 17999, 8, 'new', '128GB', 'Pink', '#F8C8DC', '[]', 24, 'iphone-15', true),
  ('iPhone 14 Pro', 'iphone-14-pro', 19999, 4, 'refurbished', '128GB', 'Deep Purple', '#592F5B', '[]', 12, 'iphone-14', true),
  ('iPhone 14', 'iphone-14', 13999, 6, 'refurbished', '256GB', 'Blue', '#A3C4E8', '[]', 12, 'iphone-14', false),
  ('iPhone 13', 'iphone-13', 10999, 10, 'refurbished', '128GB', 'Midnight', '#2D2D3A', '[]', 6, 'iphone-13', false);
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
advocates-iphones/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Homepage
│   ├── shop/page.tsx       # Product catalog
│   ├── product/[slug]/     # Product detail pages
│   ├── cart/page.tsx       # Cart page
│   ├── checkout/           # Checkout flow
│   └── admin/              # Admin dashboard
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── layout/             # Header, Footer, CartDrawer
│   ├── storefront/         # ProductCard, ProductGrid, Hero
│   └── checkout/          # CheckoutForm, OrderSummary
├── lib/
│   ├── supabase.ts         # Supabase client
│   ├── utils.ts            # Utility functions
│   └── types.ts            # TypeScript types
├── store/
│   └── cart.ts             # Cart state management
└── public/                 # Static assets
```

## Customizing

- **Products**: Add/edit products in Supabase dashboard or admin panel
- **Branding**: Edit `components/layout/` for header/footer changes
- **Colors**: Edit `tailwind.config.ts` to update the design system
- **WhatsApp**: Update `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Set the same environment variables in Vercel's dashboard.

---

Built with ❤️ for Advocates iPhones