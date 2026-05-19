-- SUPABASE STORAGE SETUP FOR PRODUCT IMAGES

-- 1. Create a public bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 2. Storage RLS Policies

-- Allow public access to view images
create policy "Product images are publicly accessible"
on storage.objects for select
using ( bucket_id = 'product-images' );

-- Allow authenticated users (admins) to upload images
create policy "Admins can upload product images"
on storage.objects for insert
with check (
  bucket_id = 'product-images' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to update images
create policy "Admins can update product images"
on storage.objects for update
using (
  bucket_id = 'product-images' 
  and auth.role() = 'authenticated'
);

-- Allow authenticated users (admins) to delete images
create policy "Admins can delete product images"
on storage.objects for delete
using (
  bucket_id = 'product-images' 
  and auth.role() = 'authenticated'
);
