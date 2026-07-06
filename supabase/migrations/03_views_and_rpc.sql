-- Create materialized view for best selling products
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_best_sellers AS
SELECT 
    p.id as product_id,
    p.name,
    p.slug,
    p.category,
    p.price,
    p.images,
    p.stock_quantity,
    COUNT(oi.id) as number_of_orders,
    SUM(oi.quantity) as total_quantity_sold
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.status = 'confirmed' OR o.status = 'delivered'
GROUP BY p.id
ORDER BY total_quantity_sold DESC;

-- Unique index for CONCURRENTLY refreshes
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_best_sellers_id ON mv_best_sellers(product_id);

-- Secure the materialized view (Materialized views don't support RLS directly)
-- Revoke access from public API roles to prevent unrestricted access
REVOKE ALL ON mv_best_sellers FROM PUBLIC;
REVOKE ALL ON mv_best_sellers FROM anon;
REVOKE ALL ON mv_best_sellers FROM authenticated;
-- Allow admin operations (service_role) to read it for reporting
GRANT SELECT ON mv_best_sellers TO service_role;

-- RPC function to get product details with inventory status quickly
CREATE OR REPLACE FUNCTION get_product_inventory_status(p_slug TEXT)
RETURNS TABLE (
    id UUID,
    name TEXT,
    stock_quantity INT,
    status TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.stock_quantity,
        CASE
            WHEN p.stock_quantity > 10 THEN 'In Stock'
            WHEN p.stock_quantity > 0 THEN 'Low Stock'
            ELSE 'Out of Stock'
        END AS status
    FROM products p
    WHERE p.slug = p_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable pg_stat_statements for monitoring slow queries
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
