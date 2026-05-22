# Implementation Plan: Orders & Inventory Refactor

This plan refactors the inventory system to support non-unique items with quantities and secures the order management system.

## 1. Database Schema & RLS Updates
- [x] **Migration: Add Stock Quantity**
  - Add `stock_quantity` (INTEGER, default 0) to the `products` table.
  - (Optional) Populate `stock_quantity` based on current `availability` (available = 1, sold = 0).
- [x] **Migration: Fix RLS Policies**
  - Update `orders` SELECT policy: Restrict to specific admin emails or a robust `is_admin` check.
  - Update `order_items` SELECT policy: Same as `orders`.
  - Ensure `INSERT` remains public for guest checkout.
- [x] **Migration: Cleanup Reservation Logic**
  - Remove RPC functions: `reserve_product`, `confirm_sale`, `release_product`, `release_expired_reservations`.
  - Remove `reserved_at` column from `products`.

## 2. Backend API Refactor (`app/api/orders/route.ts`)
- [x] **POST (Checkout)**
  - Remove reservation RPC calls.
  - Add logic to check if `stock_quantity >= quantity` for all items in the cart.
  - Atomically decrement `stock_quantity` upon successful order creation.
- [x] **PATCH (Update Status)**
  - If status changed to `cancelled`, increment `stock_quantity` back.
  - Remove `confirm_sale` / `release_product` RPC calls.
- [x] **GET (List Orders)**
  - Remove `release_expired_reservations` RPC call.

## 3. Frontend: Product Management & Display
- [x] **Admin: Product Form**
  - Add "Stock Quantity" field to `components/admin/ProductForm.tsx`.
  - Ensure `stock_quantity` is sent in CREATE/UPDATE requests.
- [x] **Storefront: Product Cards & Details**
  - Update `ProductCard.tsx` and `ProductDetailsClient.tsx` to show "Out of Stock" if `stock_quantity <= 0`.
  - Disable "Add to Cart" for out-of-stock items.
- [x] **Library: Types & Mock Data**
  - Update `lib/types.ts` to include `stock_quantity`.
  - Update `lib/mock-data.ts` for consistent testing.

## 4. Testing & Validation
- [ ] Verify guest checkout still works with the new RLS policies.
- [ ] Verify an unauthenticated user *cannot* fetch orders via API or direct Supabase query.
- [ ] Test race conditions: Try to order more items than in stock simultaneously.
- [ ] Test cancellation: Verify stock is returned to inventory.
