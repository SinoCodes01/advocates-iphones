---
name: pricing-field-design
description: Design for improving pricing fields in product form and storefront display with discount badge
metadata:
  type: reference
---

# Pricing Field Improvement Design (Approach A)

## Overview
We will enhance the product administration form and storefront product card to display a **compare (original) price** alongside the current price, with a crossed‑out style and a discount badge that shows the percentage off. This aligns with the existing visual language of the app and introduces no new bugs.

## UI Changes
- **Admin Form (`components/admin/ProductForm.tsx`)**: keep both `price` and `compare_at_price` inputs. No visual changes needed.
- **Product Card (`components/storefront/ProductCard.tsx`)**:
  - Render the original price (`compare_at_price`) crossed out when it is greater than `price`.
  - Show a small badge next to the price displaying the discount percentage, e.g., `20 % off`.
  - Badge uses the same rounded, subtle styling as existing badges (`ConditionBadge`, `StockBadge`).
  - Layout remains a two‑column price block; the badge appears inline with the current price.

## Component Updates
1. **Add utility** `formatDiscount` in `lib/utils.ts` to compute and format the percentage discount.
2. **Update `ProductCard`**:
   ```tsx
   {product.compare_at_price && product.compare_at_price > product.price && (
     <div className="flex items-center gap-2">
       <span className="text-sm line-through text-gray-400">
         {formatPrice(product.compare_at_price)}
       </span>
       <span className="bg-brand-100 text-brand-800 text-xs font-medium px-2 py-1 rounded">
         {formatDiscount(product.price, product.compare_at_price)}
       </span>
     </div>
   )}
   ```
3. **Conditional rendering** ensures that if `compare_at_price` is missing or not greater than `price`, the UI falls back to the current single‑price display – preserving existing behavior.

## Data Handling
- No schema changes are required; the admin already stores `compare_at_price`.
- The API (`app/api/products/route.ts`) already returns the field, so the storefront receives it unchanged.
- The discount badge is purely presentational; it does not affect any pricing calculations or order processing.

## Testing Considerations
- **Unit test** for `formatDiscount` covering: normal discount, zero discount, and edge cases (division by zero).
- **Component snapshot / RTL test** for `ProductCard` verifying:
  - Shows crossed‑out price and badge when `compare_at_price > price`.
  - Shows only the current price when `compare_at_price` is missing or equal.
- **E2E visual regression** (if a Cypress/Playwright suite exists) to confirm the badge layout matches the design system.

## Acceptance Criteria
- Admin form continues to accept and save both price fields.
- Storefront product cards display the crossed‑out original price and a discount badge **only** when the original price is higher.
- No layout shift or overflow occurs on mobile breakpoints.
- All existing tests pass, and the new unit/component tests are green.

---
*Design approved for implementation.*
