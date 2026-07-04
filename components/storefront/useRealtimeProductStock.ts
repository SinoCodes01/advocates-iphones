"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

function isChannelForProduct(channel: any, channelName: string) {
  if (!channel) {
    return false;
  }

  const topic = channel.topic;
  return topic === channelName || topic === `realtime:${channelName}`;
}

export function useRealtimeProductStock(
  productId?: string | number,
  onStockChange?: (stockQuantity: number) => void
) {
  const channelRef = useRef<any>(null);
  const callbackRef = useRef(onStockChange);

  useEffect(() => {
    callbackRef.current = onStockChange;
  }, [onStockChange]);

  useEffect(() => {
    if (!productId || !supabase) {
      return;
    }

    const channelName = `product-stock-${productId}`;
    const client = supabase;

    if (channelRef.current && !isChannelForProduct(channelRef.current, channelName)) {
      client.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    let channel = channelRef.current;

    if (!channel) {
      channel = client.channel(channelName);
      channelRef.current = channel;

      channel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "products",
          filter: `id=eq.${productId}`,
        },
        (payload: { new?: { stock_quantity?: number | string | null } }) => {
          const nextStock = Number(payload.new?.stock_quantity ?? 0);
          callbackRef.current?.(nextStock);
        }
      );

      channel.subscribe((status: string) => {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[realtime-product-stock]", {
            productId,
            topic: channel?.topic,
            status,
          });
        }

        if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          channelRef.current = null;
        }
      });
    }

    return () => {
      const channelToCleanup = channelRef.current;

      if (channelToCleanup && isChannelForProduct(channelToCleanup, channelName)) {
        client.removeChannel(channelToCleanup);
        channelRef.current = null;
      }
    };
  }, [productId]);
}
