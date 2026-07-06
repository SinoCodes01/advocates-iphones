import { createClient } from "./supabase-server";
import { Product } from "./types";
import { unstable_cache } from "next/cache";
import { Database } from "./database.types";

type DbProduct = Database["public"]["Tables"]["products"]["Row"];

/**
 * Normalizes database product data to frontend Product type
 */
function normalizeProduct(product: DbProduct): Product {
  return {
    ...product,
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || undefined,
    price: product.price,
    compareAtPrice: product.compare_at_price || undefined,
    stockQuantity: (product as any).stock_quantity || product.stock_quantity || 0,
    condition: (product.condition as any) || "new",
    storage: product.storage || undefined,
    color: product.color || undefined,
    colorHex: product.color_hex || undefined,
    images: product.images || [],
    warrantyMonths: product.warranty_months || 12,
    batteryHealth: product.battery_health || undefined,
    category: product.category || undefined,
    active: !!product.active,
    featured: !!product.featured,
    createdAt: product.created_at || "",
  };
}

/**
 * Fetches all active products with optional filtering
 * Cached for performance
 */
export const getProducts = (filters: {
  category?: string[];
  condition?: string[];
  storage?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  limit?: number;
  includeOutOfStock?: boolean;
} = {}) => {
  const cacheKey = ["products-list", JSON.stringify(filters)];
  
  return unstable_cache(
    async () => {
      const supabase = createClient();
      let query = supabase
        .from("products")
        .select("id, active, battery_health, category, color, color_hex, compare_at_price, condition, created_at, description, featured, images, name, price, slug, storage, stock_quantity, warranty_months")
        .eq("active", true)
        .order("created_at", { ascending: false });

      // Show all active products regardless of stock by default
      // Use filters.includeOutOfStock if explicit filtering is needed
      if (filters.includeOutOfStock === false) {
        query = query.gt("stock_quantity", 0);
      }

      if (filters.featured !== undefined) {
        query = query.eq("featured", filters.featured);
      }

      if (filters.category && filters.category.length > 0) {
        query = query.in("category", filters.category);
      }

      if (filters.condition && filters.condition.length > 0) {
        query = query.in("condition", filters.condition);
      }

      if (filters.storage && filters.storage.length > 0) {
        query = query.in("storage", filters.storage);
      }

      if (filters.minPrice) {
        query = query.gte("price", filters.minPrice);
      }

      if (filters.maxPrice) {
        query = query.lte("price", filters.maxPrice);
      }

      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,storage.ilike.%${filters.search}%,color.ilike.%${filters.search}%`
        );
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }

      return data.map(normalizeProduct);
    },
    cacheKey,
    { revalidate: 60, tags: ["products"] }
  )();
};

/**
 * Fetches a single product by its slug
 * Cached for performance
 */
export const getProductBySlug = (slug: string) => {
  return unstable_cache(
    async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("products")
        .select("id, active, battery_health, category, color, color_hex, compare_at_price, condition, created_at, description, featured, images, name, price, slug, storage, stock_quantity, warranty_months")
        .eq("slug", slug)
        .eq("active", true)
        .single();

      if (error || !data) {
        if (error && error.code !== "PGRST116") {
          console.error("Error fetching product by slug:", error);
        }
        return null;
      }

      return normalizeProduct(data);
    },
    ["product-detail", slug],
    { revalidate: 60, tags: ["products"] }
  )();
};

/**
 * Fetches all product slugs for static generation
 */
export async function getProductSlugs() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("slug")
    .eq("active", true);

  if (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }

  return data.map((p) => p.slug);
}
