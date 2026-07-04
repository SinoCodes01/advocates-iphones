# Supabase Realtime Error - Root Cause Analysis & Fix Report

**Date:** 2026-07-04  
**Error:** `Error: cannot add 'postgres_changes' callbacks for realtime:product-stock-* after 'subscribe()'`

---

## 1. ROOT CAUSE ANALYSIS

### The Error Explained

This error occurs when Supabase Realtime receives a request to attach a listener (`.on()`) to a channel **after** it has already been subscribed (`.subscribe()` has been called). The correct order must be:

```
✓ CORRECT:
channel = client.channel(name)
  .on('postgres_changes', {...}, handler)
  .subscribe()

✗ WRONG:
channel = client.channel(name)
channel.subscribe()
channel.on('postgres_changes', {...}, handler)  // ERROR!
```

### Why It Happened in This Codebase

The issue was **not** an incorrect subscription order in a single render cycle. Instead, it was a **cascade of re-renders** caused by unstable callback dependencies:

#### **Problem Chain:**

1. **Parent Component** ([ProductCard.tsx](components/storefront/ProductCard.tsx), [ProductDetailsClient.tsx](components/storefront/ProductDetailsClient.tsx))
   - Called `useRealtimeProductStock(product.id, setCurrentStockQuantity)`
   - Passed `setCurrentStockQuantity` directly as a callback
   - **Issue:** This callback reference is **recreated on every render** (React state setters are always new references)

2. **Hook Dependency Array** ([useRealtimeProductStock.ts](components/storefront/useRealtimeProductStock.ts#L37))
   - `}, [productId, onStockChange])`
   - Includes `onStockChange` (the callback) in dependencies ✓ Correct pattern
   - But the callback reference **changed on every parent render** ✗ Problem

3. **Effect Re-execution**
   - When parent re-renders → new `setCurrentStockQuantity` reference
   - Hook's dependency check: `onStockChange` reference changed → effect re-runs
   - **Every time the effect runs:**
     - Line 35: `client.removeChannel(channel)` → Removes old subscription
     - Line 16: `const channel = client.channel(...)` → Creates NEW channel instance
     - Lines 18-30: `.on('postgres_changes', ...)` → Attaches listener
     - Line 32: `.subscribe()` → Subscribes

4. **The Race Condition**
   - If `removeChannel()` timing is slow/async, old subscription may still be processing
   - Meanwhile, hook creates NEW channel, calls `.on()`, then `.subscribe()`
   - If done correctly, this works. But if the old channel is still in an active state...
   - **Result:** Supabase thinks we're trying to add listeners to an already-active channel → ERROR

5. **React Strict Mode Amplification** (Development Only)
   - In development, React Strict Mode intentionally double-renders components to catch side effects
   - Each component mounts: effect runs, cleanup runs, effect runs again
   - This **doubles the subscription attempts** in rapid succession
   - Makes the race condition **much more likely to occur**

### Product Stock Changes Trigger Parent Re-renders

When the product's `stockQuantity` changes:

```javascript
useEffect(() => {
  setCurrentStockQuantity(product.stockQuantity);  // State update triggers re-render
}, [product.stockQuantity]);
```

This causes a parent re-render → new `setCurrentStockQuantity` reference → hook re-runs → error

---

## 2. AFFECTED FILES

| File | Issue | Line(s) |
|------|-------|---------|
| [components/storefront/useRealtimeProductStock.ts](components/storefront/useRealtimeProductStock.ts) | Unstable channel reference, no channel reuse logic, missing state checks | 16, 18-30, 32, 35 |
| [components/storefront/ProductCard.tsx](components/storefront/ProductCard.tsx) | Callback passed directly without `useCallback` wrapper | 28 |
| [components/storefront/ProductDetailsClient.tsx](components/storefront/ProductDetailsClient.tsx) | Callback passed directly without `useCallback` wrapper | 42 |

---

## 3. PROPOSED SOLUTION

### Strategy: Three-Part Fix

#### **Part 1: Stabilize Callback References** ✓
- Wrap callbacks in `useCallback` in parent components
- Ensures callback reference only changes when its dependencies change (none in this case)
- Prevents unnecessary effect re-runs

**Files Modified:**
- [components/storefront/ProductCard.tsx](components/storefront/ProductCard.tsx#L1-L30)
- [components/storefront/ProductDetailsClient.tsx](components/storefront/ProductDetailsClient.tsx#L1-L43)

#### **Part 2: Add Channel Reuse & State Checking** ✓
- Use `useRef` to persist channel reference across renders
- Check if channel already exists before creating new one
- Add subscription state checks to prevent duplicate subscriptions
- Subscribe callback to handle channel errors/closures

**File Modified:**
- [components/storefront/useRealtimeProductStock.ts](components/storefront/useRealtimeProductStock.ts)

#### **Part 3: Proper Cleanup** ✓
- Clear `channelRef` on channel error/close
- Clear `channelRef` in cleanup function
- Prevents orphaned channel references

---

## 4. IMPLEMENTATION DETAILS

### Change 1: ProductCard.tsx

**Before:**
```typescript
useRealtimeProductStock(product.id, setCurrentStockQuantity);
```

**After:**
```typescript
const handleStockChange = useCallback((stockQuantity: number) => {
  setCurrentStockQuantity(stockQuantity);
}, []);

useRealtimeProductStock(product.id, handleStockChange);
```

**Import Added:**
```typescript
import { useState, useEffect, useCallback } from "react";  // +useCallback
```

**Benefit:** `handleStockChange` reference is stable (never changes), hook won't re-run unnecessarily.

---

### Change 2: ProductDetailsClient.tsx

**Before:**
```typescript
useRealtimeProductStock(product.id, setCurrentStockQuantity);
```

**After:**
```typescript
const handleStockChange = useCallback((stockQuantity: number) => {
  setCurrentStockQuantity(stockQuantity);
}, []);

useRealtimeProductStock(product.id, handleStockChange);
```

**Import Added:**
```typescript
import { useState, useEffect, useCallback } from "react";  // +useCallback
```

**Benefit:** Same as ProductCard - stable callback reference.

---

### Change 3: useRealtimeProductStock.ts (Most Important)

**Before:**
```typescript
export function useRealtimeProductStock(
  productId?: string | number,
  onStockChange?: (stockQuantity: number) => void
) {
  useEffect(() => {
    if (!productId || !supabase) {
      return;
    }

    const client = supabase;
    const channel = client.channel(`product-stock-${productId}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
          filter: `id=eq.${productId}`,
        },
        (payload) => {
          const nextStock = Number(payload.new?.stock_quantity ?? 0);
          onStockChange?.(nextStock);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [productId, onStockChange]);
}
```

**After:**
```typescript
export function useRealtimeProductStock(
  productId?: string | number,
  onStockChange?: (stockQuantity: number) => void
) {
  const channelRef = useRef<any>(null);  // NEW: Persist channel reference

  useEffect(() => {
    if (!productId || !supabase) {
      return;
    }

    const channelName = `product-stock-${productId}`;
    const client = supabase;

    // Check if channel already exists and is in a valid state
    let channel = channelRef.current;  // NEW: Reuse existing channel

    if (!channel) {
      // Create new channel only if it doesn't exist
      channel = client.channel(channelName);
      channelRef.current = channel;

      // Attach listener BEFORE subscribing
      channel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
          filter: `id=eq.${productId}`,
        },
        (payload) => {
          const nextStock = Number(payload.new?.stock_quantity ?? 0);
          onStockChange?.(nextStock);
        }
      );

      // Subscribe only after all listeners are attached
      channel.subscribe((status) => {  // NEW: Handle subscription status
        if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          // Reset channel reference on error or close
          channelRef.current = null;
        }
      });
    } else if (channel.state !== "subscribed") {  // NEW: Check state
      // If channel exists but isn't subscribed, resubscribe
      channel.subscribe();
    }

    return () => {
      if (channelRef.current) {
        client.removeChannel(channelRef.current);
        channelRef.current = null;  // NEW: Clear reference after cleanup
      }
    };
  }, [productId, onStockChange]);
}
```

**Key Changes:**
1. **useRef for persistence** (line 9): Channel reference survives across renders
2. **Channel reuse logic** (line 22-24): Check if channel already exists before creating
3. **Subscription status callback** (line 44-47): Handle errors and resets
4. **State validation** (line 48-51): Check if channel needs resubscription
5. **Reference cleanup** (line 56-59): Clear ref after removal

**Benefits:**
- Prevents duplicate channel creation on re-renders
- Prevents calling `.on()` after `.subscribe()`
- Handles subscription failures gracefully
- Properly cleans up resources

---

## 5. VERIFICATION STEPS

### Step 1: Check Browser Console

After applying fixes, the error should NOT appear:
```
❌ Before: Error: cannot add `postgres_changes` callbacks for realtime:product-stock-* after `subscribe()`
✓ After: (no error)
```

### Step 2: Monitor Active Channels

Add temporary logging to verify channel reuse:

```typescript
// In useRealtimeProductStock.ts, after line 55
console.log('Active channels:', supabase.getChannels().map(c => ({
  topic: c.topic,
  state: c.state
})));
```

**Expected Output (for a product viewed once):**
```javascript
Active channels: [
  {
    topic: "realtime:product-stock-12345",
    state: "subscribed"
  }
]
```

**Should NOT show duplicates** like:
```javascript
// ❌ WRONG - Duplicates indicate re-subscription issue
Active channels: [
  { topic: "realtime:product-stock-12345", state: "subscribed" },
  { topic: "realtime:product-stock-12345", state: "subscribed" }  // DUPLICATE!
]
```

### Step 3: Test React Strict Mode

1. Open application in development mode
2. Navigate to product pages
3. Verify no console errors appear (React Strict Mode will still double-mount, but error should not occur)

### Step 4: Test Real-Time Updates

1. Open two browser windows: product page and admin dashboard
2. Update product stock in admin dashboard
3. Verify stock quantity updates in real-time on product page
4. No errors in console

### Step 5: Test Page Navigation

1. Browse from shop → product details
2. Navigate back to shop
3. Navigate to different products
4. Verify no console errors on any navigation

---

## 6. WHY THIS FIX WORKS

### Before (Broken):
```
Parent Render 1 → new setCurrentStockQuantity → Hook effect runs
  → Create channel → .on() → .subscribe() ✓

Parent Render 2 (due to product change) → new setCurrentStockQuantity → Hook effect runs
  → Create NEW channel → .on() → .subscribe() ✗ ERROR (old channel still subscribed)
```

### After (Fixed):
```
Parent Render 1 → handleStockChange (stable ref) → Hook effect runs
  → Create channel (stored in ref) → .on() → .subscribe() ✓

Parent Render 2 (due to product change) → handleStockChange (SAME ref) → Hook effect does NOT run
  → No re-subscription, no error ✓

If parent Render 3 (due to OTHER reason) → Hook effect runs
  → Channel already exists in ref → Skip creation, check state
  → If subscribed, skip resubscribe ✓
```

---

## 7. EDGE CASES HANDLED

| Case | Before | After |
|------|--------|-------|
| **React Strict Mode (dev)** | Double subscription attempt → Error | Stable callback + reuse logic → No error |
| **Page Navigation** | Channel created/destroyed each time | Channel persists, only cleared on dismount |
| **Rapid Stock Updates** | Multiple hook effect runs | Stable callback prevents effect re-runs |
| **Channel Error/Close** | Orphaned reference | Automatically reset on error callback |
| **ProductId Changes** | New subscription attempted | Old channel cleaned up, new one created |

---

## 8. PERFORMANCE IMPACT

### Positive:
- ✓ Fewer channel creations (1 per product instead of N per render)
- ✓ Fewer `.subscribe()` calls (1 per mount instead of N per render)
- ✓ Fewer cleanup operations (1 per unmount instead of N per render)
- ✓ Reduced network traffic to Supabase

### Neutral:
- No significant change to bundle size (useRef and useCallback are built-in React)
- No performance regression on non-product pages

---

## 9. TESTING CHECKLIST

- [ ] No errors in browser console on any page
- [ ] Product stock updates in real-time
- [ ] No duplicate channels reported by `getChannels()`
- [ ] Navigation between products works smoothly
- [ ] Works in React Strict Mode (development)
- [ ] Works in production mode (build & test)
- [ ] Multiple products on same page work independently

---

## 10. FILES MODIFIED

1. **[components/storefront/useRealtimeProductStock.ts](components/storefront/useRealtimeProductStock.ts)**
   - Added `useRef` import
   - Added `channelRef` for persistence
   - Added channel reuse logic
   - Added subscription state validation
   - Added error handling callback
   - Improved cleanup

2. **[components/storefront/ProductCard.tsx](components/storefront/ProductCard.tsx)**
   - Added `useCallback` import
   - Wrapped callback in `useCallback`

3. **[components/storefront/ProductDetailsClient.tsx](components/storefront/ProductDetailsClient.tsx)**
   - Added `useCallback` import
   - Wrapped callback in `useCallback`

---

## Conclusion

The error was caused by a **cascade of re-renders due to unstable callback dependencies**, combined with **React Strict Mode amplification in development**. The fix addresses all three layers:

1. **Stabilize callbacks** → Prevent unnecessary effect re-runs
2. **Reuse channels** → Prevent duplicate subscriptions
3. **Handle errors** → Graceful recovery from subscription failures

The implementation follows Supabase best practices and React hooks guidelines.
