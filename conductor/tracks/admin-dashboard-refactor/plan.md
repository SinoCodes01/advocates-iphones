# Implementation Plan: Admin Dashboard Improvement

This plan focuses on securing the admin dashboard, ensuring robust CRUD operations, and optimizing the image upload flow.

## 1. Security & Route Protection
- [ ] Create `middleware.ts` in the root directory to protect `/admin` routes using Supabase Auth.
- [ ] Verify that `/admin` redirects to `/admin/login` for unauthenticated users.
- [ ] Ensure API routes (`/api/products`, `/api/orders`) strictly verify sessions for non-GET requests.

## 2. Product CRUD & Active Status
- [ ] Update `ProductForm.tsx` to ensure the `active` flag is correctly sent to the backend.
- [ ] Verify that deactivating a product (setting `active: false`) hides it from the storefront but keeps it visible in the admin.
- [ ] Fix any mapping issues between CamelCase and SnakeCase for database fields (e.g., `compare_at_price`).

## 3. Image Optimization & Upload
- [ ] Install `browser-image-compression` dependency.
- [ ] Update `components/admin/ImageUpload.tsx` to compress images to < 1MB and max 1200px before uploading to Supabase Storage.
- [ ] Ensure images are stored in a predictable folder structure (e.g., `products/{id}/filename`).

## 4. UI Synchronization & UX
- [ ] Ensure `fetchData` is called after every successful create/update/delete operation in the Admin Dashboard.
- [ ] Add toast notifications for success/error states (if not already present).
- [ ] Verify that the "Storefront" correctly reflects changes made in the Admin.

## 5. Testing & Validation
- [ ] Test login flow.
- [ ] Test creating a product with large images (verify compression).
- [ ] Test editing and deactivating a product.
- [ ] Test deleting a product and verify cleanup (if applicable).
