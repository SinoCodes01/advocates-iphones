-- Create store_settings table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id text PRIMARY KEY DEFAULT 'default',
    free_delivery_threshold numeric NOT NULL DEFAULT 20000,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Insert default settings
INSERT INTO public.store_settings (id, free_delivery_threshold)
VALUES ('default', 20000)
ON CONFLICT (id) DO NOTHING;

-- Create promotions table
CREATE TABLE IF NOT EXISTS public.promotions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    label text NOT NULL,
    title text NOT NULL,
    href text NOT NULL,
    active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Insert default promotions
INSERT INTO public.promotions (label, title, href, active, display_order) VALUES
('Winter Sale', 'Up to 12% off selected iPhones this season', '/shop', true, 1),
('Free Delivery', 'On all orders above R20,000 nationwide', '/help/delivery', true, 2),
('Verified Quality', 'Every device includes a comprehensive warranty', '/help/warranty', true, 3);

-- Add RPC function for bulk discount to make it atomic and fast
CREATE OR REPLACE FUNCTION apply_bulk_discount(discount_percentage numeric)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.products
  SET 
    compare_at_price = CASE 
      WHEN compare_at_price IS NULL OR compare_at_price <= price THEN price 
      ELSE compare_at_price 
    END,
    price = ROUND(price * (1 - (discount_percentage / 100)));
END;
$$;
