# Pricing Field Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show the original (compare) price crossed out with a discount badge on product cards, using the existing admin fields.

**Architecture:** Add a small presentational utility to compute discount percentages and extend `ProductCard` to conditionally render the original price and badge. No backend changes required.

**Tech Stack:** React, TypeScript, Tailwind CSS, Jest + React Testing Library for unit/component tests.

---

### Task 1: Add discount utility function

**Files:**
- Modify: `lib/utils.ts`

- [ ] **Step 1: Write failing test**
```tsx
// tests/lib/utils/formatDiscount.test.ts
import { formatDiscount } from '@/lib/utils';

test('calculates discount percentage correctly', () => {
  expect(formatDiscount(80, 100)).toBe('20 % off');
});
```
- [ ] **Step 2: Run test to verify it fails**
```
npm test tests/lib/utils/formatDiscount.test.ts -- -t "calculates discount"
```
- [ ] **Step 3: Implement minimal function**
```ts
export function formatDiscount(price: number, compareAtPrice: number): string {
  if (!compareAtPrice || compareAtPrice <= price) return '';
  const discount = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  return `${discount} % off`;
}
```
- [ ] **Step 4: Run test to verify it passes**
```
npm test tests/lib/utils/formatDiscount.test.ts -- -t "calculates discount"
```
- [ ] **Step 5: Commit**
```
git add lib/utils.ts tests/lib/utils/formatDiscount.test.ts
git commit -m "feat: add formatDiscount utility and tests"
```

### Task 2: Update ProductCard to display compare price and badge

**Files:**
- Modify: `components/storefront/ProductCard.tsx`
- Modify: `components/storefront/ProductCard.tsx:70-80` (price block)

- [ ] **Step 1: Write failing component test**
```tsx
// tests/components/storefront/ProductCard.discount.test.tsx
import { render, screen } from '@testing-library/react';
import { ProductCard } from '@/components/storefront/ProductCard';
import { Product } from '@/lib/types';

test('shows original price crossed out and discount badge when compare price is higher', () => {
  const product: Product = {
    id: '1',
    name: 'Test Phone',
    slug: 'test-phone',
    price: 800,
    compare_at_price: 1000,
    stock: 5,
    condition: 'new',
    storage: '128GB',
    color: 'Black',
    color_hex: '#000000',
    category: 'iPhone',
    description: '',
    warrantyMonths: 12,
    batteryHealth: 100,
    active: true,
    featured: false,
    images: [],
  };
  render(<ProductCard product={product} />);
  expect(screen.getByText('R1,000')).toHaveClass('line-through');
  expect(screen.getByText('20 % off')).toBeInTheDocument();
});
```
- [ ] **Step 2: Run test to verify it fails**
```
npm test tests/components/storefront/ProductCard.discount.test.tsx -- -t "discount"
```
- [ ] **Step 3: Implement UI changes**
```tsx
{/* Replace price block in ProductCard.tsx */}
<div className="mt-auto pt-4 flex items-end justify-between">
  <div>
    {product.compare_at_price && product.compare_at_price > product.price && (
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm text-gray-400 line-through">
          {formatPrice(product.compare_at_price)}
        </span>
        <span className="bg-brand-100 text-brand-800 text-xs font-medium px-2 py-1 rounded">
          {formatDiscount(product.price, product.compare_at_price)}
        </span>
      </div>
    )}
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-black text-navy-900">
        {formatPrice(product.price)}
      </span>
    </div>
    <div className="flex items-center gap-1 mt-1">
      <Shield className="w-3 h-3 text-brand-500" />
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
        {product.warrantyMonths} Months Warranty
      </span>
    </div>
  </div>
  <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center group-hover:bg-brand-500 transition-colors shadow-lg shadow-navy-900/10 group-hover:shadow-brand-500/20">
    <ShoppingBag className="w-5 h-5 text-white" />
  </div>
</div>
```
- [ ] **Step 4: Run component test to verify it passes**
```
npm test tests/components/storefront/ProductCard.discount.test.tsx -- -t "discount"
```
- [ ] **Step 5: Commit**
```
git add components/storefront/ProductCard.tsx tests/components/storefront/ProductCard.discount.test.tsx lib/utils.ts
git commit -m "feat: display compare price with discount badge on product cards"
```

### Task 3: Update styling (Tailwind) if needed

**Files:**
- Modify: `app/globals.css` (if custom colors not defined)

- [ ] **Step 1: Verify existing Tailwind config includes `bg-brand-100` and `text-brand-800`. If missing, add them to `tailwind.config.js`.
- [ ] **Step 2: Run linter/build to ensure no CSS errors.
- [ ] **Step 3: Commit any Tailwind config changes.**
```
git add tailwind.config.js
git commit -m "chore: ensure brand colors for discount badge"
```

### Task 4: Run full test suite and visual regression check

- [ ] **Step 1: Run all tests**
```
npm test
```
- [ ] **Step 2: Run the dev server and manually verify the product card UI for a product with a compare price.
```
npm run dev
```
- [ ] **Step 3: Commit any final tweaks**
```
git add .
git commit -m "chore: final polish for pricing field improvement"
```

---

**Self‑Review Checklist**
- All spec requirements covered (admin form unchanged, storefront shows crossed‑out price and badge only when appropriate).
- No placeholders remain.
- Types and property names match the existing `Product` type.
- Each step contains concrete code or commands.

---

Plan complete and saved to `docs/superpowers/plans/2026-05-20-pricing-field-improvement-plan.md`.

**Execution options:**
1. **Subagent‑Driven** – dispatch a fresh subagent per task with review checkpoints (recommended).
2. **Inline Execution** – run tasks in this session using the executing‑plans skill.

Which approach would you like to use?