-- Indexes for promotions table to speed up storefront queries
CREATE INDEX IF NOT EXISTS idx_promotions_active ON promotions(active);
CREATE INDEX IF NOT EXISTS idx_promotions_display_order ON promotions(display_order);
