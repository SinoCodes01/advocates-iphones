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
    availability: product.availability || "available",
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
    reservedAt: product.reserved_at || undefined,
    createdAt: product.created_at || "",
  };
}

/**
 * Fetches all active products with optional filtering
 * Cached for performance
 */
export const getProducts = unstable_cache(
  async (filters: {
    category?: string[];
    condition?: string[];
    storage?: string[];
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
    limit?: number;
    includeReserved?: boolean;
  } = {}) => {
    const supabase = createClient();
    let query = supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });

    // Only show available products by default
    if (!filters.includeReserved) {
      query = query.eq("availability", "available");
    } else {
      query = query.in("availability", ["available", "reserved"]);
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
  ["products-list"],
  { revalidate: 3600, tags: ["products"] }
);

/**
 * Fetches a single product by its slug
 * Cached for performance
 */
export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
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
  ["product-detail"],
  { revalidate: 3600, tags: ["products"] }
);

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
