# Plan: Admin Product CRUD, Image Upload & Auth Refactor

This plan outlines the steps to implement full CRUD functionality for products, refactor image handling to Supabase Storage with optimization, and secure the admin dashboard with Supabase Auth. **A primary focus is ensuring that all changes (Additions, Edits, Deletions) are immediately and accurately reflected in both the Backend (Supabase DB/Storage) and the Frontend UI (Admin Dashboard & Storefront).**

## Objective
- Enable reliable Create, Read, Update, and Delete operations for products.
- Implement a secure, drag-and-drop file upload system with client-side optimization.
- Secure admin routes and API endpoints using Supabase Authentication.
- **Guarantee synchronization between the database and UI state across the entire application.**

## Key Files & Context
- `components/admin/ProductForm.tsx`: The main form for adding/editing products.
- `app/admin/page.tsx`: The admin dashboard listing products.
- `app/api/products/route.ts`: API endpoints for product operations.
- `lib/supabase.ts`: Supabase client configuration.
- `app/admin/login/page.tsx`: (New) Admin login page.

## Implementation Steps

### 1. Security & Authentication
- **Setup Supabase Auth:** Configure the admin email (`ngqazolosinovuyo50@gmail.com`) as a user in Supabase.
- **Admin Login Page:** Create `app/admin/login/page.tsx`.
- **Route Protection:** Implement a middleware or layout-level check to redirect unauthenticated users from `/admin/*`.
- **API Security:** Update `/api/products` and `/api/orders` to verify the user's session before allowing write/delete operations.

### 2. Supabase Storage Setup
- Create a public bucket named `product-images`.
- Define RLS policies:
    - `public` read access for everyone.
    - `authenticated` write/delete access (restricted to the admin user).
- **Naming Convention:** Store images in folders named by `product_id` (e.g., `products/{id}/{filename}`) to avoid slug-change breakage.

### 3. Image Optimization & Upload
- **Optimization:** Use `browser-image-compression` to resize images (max width 1200px) and compress them (max 1MB) before upload.
- **Component:** Refactor `ProductForm` to include a file uploader with previews.
- **Atomic-ish Logic:** Implement a "cleanup on failure" pattern—if the DB save fails after images are uploaded, attempt to delete the newly uploaded images to prevent "zombie" files.

### 4. Refactor ProductForm.tsx & Admin Sync
- Integrate optimization and upload logic.
- **State Synchronization:** Update the `onSuccess` callback in `ProductForm` and the `handleDelete` logic in `AdminPage` to ensure the product list is re-fetched or updated locally, guaranteeing the UI reflects the latest backend state.
- Update `handleSubmit` to:
    1. Compress selected files.
    2. Upload to storage using the product's ID.
    3. Update the `formData.images` array with public URLs.
    4. Save to database.

### 5. Verification & Testing (UI/Backend Sync)
- **Auth:** Verify `/admin` is inaccessible without logging in.
- **Create:** Add a product; verify it appears in the Admin List, the Storefront, and the Supabase DB.
- **Edit:** Change a price/image; verify the change is visible immediately in the Admin Dashboard and Storefront.
- **Delete:** Remove a product; verify it disappears from the UI and is deleted from the DB and Storage.
- **Optimization:** Verify uploaded file sizes in the Supabase dashboard.

## Verification & Testing
- Manually test adding a new product with multiple large images.
- Verify images are optimized and stored in the correct ID-based folder.
- Test deleting a product and verify it's removed from both DB and UI.

## Migrations & Rollback
- **Migration:** Run the provided SQL script to set up the bucket and RLS.
- **Rollback:** Revert `ProductForm.tsx` and disable the auth middleware.
