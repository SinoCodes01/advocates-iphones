"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useRealtimeProductStock(
  productId?: string | number,
  onStockChange?: (stockQuantity: number) => void
) {
  useEffect(() => {
    if (!productId || !supabase) return;

    const channel = supabase.channel(`product-stock-${productId}`);

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
      supabase.removeChannel(channel);
    };
  }, [productId, onStockChange]);
}
