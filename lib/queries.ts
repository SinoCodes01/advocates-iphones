import { Product } from "@/lib/types";

// ─── Query Keys ────────────────────────────────────────────────────────────────
// Centralized key factory keeps cache invalidation consistent across the app.
export const queryKeys = {
  promotions: ["promotions"] as const,
  settings: ["settings"] as const,
  products: (params?: Record<string, string>) =>
    params ? (["products", params] as const) : (["products"] as const),
};

// ─── Fetchers ──────────────────────────────────────────────────────────────────

export async function fetchPromotions() {
  const res = await fetch("/api/promotions", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch promotions");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch promotions");
  return data.promotions as {
    id: string;
    label: string;
    title: string;
    href: string;
    active: boolean;
    display_order: number;
    created_at: string;
  }[];
}

export async function fetchSettings() {
  const res = await fetch("/api/settings", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch settings");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch settings");
  return data.settings as { free_delivery_threshold: number };
}

export async function fetchProducts(params: Record<string, string> = {}) {
  const searchParams = new URLSearchParams(params);
  const res = await fetch(`/api/products?${searchParams.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Failed to fetch products");
  return data.products as Product[];
}
