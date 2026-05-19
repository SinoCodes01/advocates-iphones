# Advocates iPhones — Project Context

A premium ecommerce platform for selling iPhones and accessories, designed with a focus on trust, authenticity, and mobile-first experience.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Supabase (Database, Auth, Storage)
- **State Management:** Zustand (with persistence for Cart)
- **Icons:** Lucide React
- **Deployment:** Vercel

## Project Structure

- `app/`: Next.js App Router pages and API routes.
  - `admin/`: Admin dashboard for product and order management.
  - `api/`: Backend endpoints for products and orders.
  - `cart/`, `checkout/`, `product/[slug]/`, `shop/`: Storefront pages.
- `components/`: React components organized by feature.
  - `ui/`: Base UI components (shadcn/ui).
  - `layout/`: Shared layout components (Header, Footer, CartDrawer).
  - `storefront/`: Product cards, grids, and hero sections.
  - `admin/`, `checkout/`: Feature-specific components.
- `lib/`: Core logic and shared utilities.
  - `supabase.ts`: Supabase client initialization.
  - `types.ts`: TypeScript interfaces for Products, Orders, etc.
  - `utils.ts`: Helper functions (formatting, tailwind-merge).
- `store/`: Zustand state management (e.g., `cart.ts`).
- `public/`: Static assets.
- `supabase_schema.sql`: Reference for the database structure.

## Building and Running

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm run build
npm run start
```

### Quality Control
```bash
npm run lint
```

## Environment Configuration
Required variables in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key.
- `NEXT_PUBLIC_WHATSAPP_NUMBER`: The number used for order handoff.
- `NEXT_PUBLIC_SITE_URL`: Base URL for the site.

## Development Conventions

- **Type Safety:** Always use TypeScript. Define shared types in `lib/types.ts`.
- **UI Components:** Follow the `shadcn/ui` pattern. Components should be modular and reusable.
- **Styling:** Use Tailwind CSS. Adhere to the brand's primary palette: deep navy, electric blue, clean white, and soft cool gray.
- **State:** Use Zustand for global state. The cart state is persisted to `localStorage`.
- **Data Fetching:** Use the Supabase client (`lib/supabase.ts`) or the `/api` routes.
- **Order Flow:** Orders are stored in Supabase and then handed off to WhatsApp for manual confirmation.
- **Security:** RLS (Row Level Security) is enabled in Supabase. Admins require authentication for write access.

## Database Schema (Summary)

- `products`: ID, name, slug, price, stock, condition (new/refurbished/pre-owned), images, etc.
- `orders`: ID, order_number, customer details, status (pending/confirmed/etc.), total.
- `order_items`: Links products to orders with quantity and unit price.

---
*Refer to Advocates_Iphones_PRD.md for detailed product requirements.*
