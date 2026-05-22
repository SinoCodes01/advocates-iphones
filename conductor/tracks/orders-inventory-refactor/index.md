# Track: Orders & Inventory Refactor

## Description
Refactor the order and inventory system to handle bulk stock (non-unique items) and secure order RLS policies. This moves away from the "unique reservation" model to a standard "stock quantity" model, similar to popular e-commerce platforms like Revibe.

## Goals
- Transition inventory from a reservation-based model to a stock-quantity model.
- Secure `orders` and `order_items` RLS policies so only admins can view order data.
- Refactor the checkout API to handle stock decrements and validation.
- Update the admin dashboard to manage product quantities.

## Related Files
- `app/api/orders/route.ts`
- `lib/database.types.ts`
- `app/admin/page.tsx`
- `components/admin/ProductForm.tsx`
- `lib/products.ts`
- `lib/types.ts`

## Status
`completed`
