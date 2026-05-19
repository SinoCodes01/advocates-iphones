# Advocates iPhones MVP - Getting Started

## Quick Start

### 1. Open in VS Code

```bash
cd advocates-iphones
code .
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Open in Browser

Navigate to: http://localhost:3000

## Project Structure

```
advocates-iphones/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout (Header, Footer, Cart)
│   ├── globals.css           # Global styles
│   ├── shop/page.tsx         # Product catalog
│   ├── product/[slug]/       # Product detail pages
│   ├── cart/page.tsx         # Cart page
│   ├── checkout/page.tsx     # Checkout flow
│   ├── admin/page.tsx        # Admin dashboard
│   └── api/                  # API routes
├── components/
│   ├── ui/                   # Reusable UI (Button, Card, Badge)
│   ├── layout/               # Header, Footer, CartDrawer
│   └── storefront/           # ProductCard, ProductGrid, Hero
├── lib/
│   ├── types.ts              # TypeScript interfaces
│   ├── utils.ts              # Utility functions
│   ├── supabase.ts           # Supabase client
│   └── mock-data.ts          # Sample product/order data
├── store/
│   └── cart.ts               # Cart state (Zustand)
└── public/                   # Static assets
```

## Key Files to Edit

### Changing Colors / Theme
Edit `tailwind.config.ts` to update the brand colors:
- Navy palette: `navy-500` to `navy-900`
- Brand blue: `brand-400` to `brand-600`

### Adding Products
Edit `lib/mock-data.ts` to add or modify products.
For production, connect Supabase and manage products via the admin dashboard.

### Modifying the Header/Footer
Edit `components/layout/Header.tsx` and `components/layout/Footer.tsx`

### Changing WhatsApp Number
Update `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local`

## Deployment to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy!

## Supabase Setup (for production)

1. Create a Supabase project at supabase.com
2. Run the SQL from README.md in SQL Editor
3. Get your project URL and anon key
4. Add them to `.env.local`

## Making Changes

### To add a new page:
Create a new folder in `app/` with a `page.tsx` file.

### To add a new component:
Create a new file in `components/` and import it where needed.

### To modify product data:
Edit `lib/mock-data.ts` or connect Supabase for database storage.

## Troubleshooting

**Port 3000 already in use:**
```bash
npm run dev -- -p 3001
```

**Dependencies not installing:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Cart not updating:**
The cart uses localStorage via Zustand. Clear browser cache if issues persist.

## Next Steps

1. [ ] Set up Supabase for real data
2. [ ] Add product images
3. [ ] Configure WhatsApp Business number
4. [ ] Update branding (logo, colors, content)
5. [ ] Deploy to Vercel