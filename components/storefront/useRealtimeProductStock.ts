"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

type StockHandler = (stockQuantity: number) => void;

type ChannelRegistryEntry = {
  channel: any;
  handlers: Set<StockHandler>;
  topic: string;
};

const channelRegistry = new Map<string, ChannelRegistryEntry>();

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

    const topic = `product-stock-${productId}`;
    const client = supabase;

    const handleStockChange = (stockQuantity: number) => {
      callbackRef.current?.(stockQuantity);
    };

    let entry = channelRegistry.get(topic);

    if (!entry) {
      const channel = client.channel(topic);
      const handlers = new Set<StockHandler>();

      entry = {
        channel,
        handlers,
        topic,
      };

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
          entry!.handlers.forEach((handler) => handler(nextStock));
        }
      );

      channel.subscribe((status: string) => {
        if (process.env.NODE_ENV !== "production") {
          console.debug("[realtime-product-stock]", {
            productId,
            topic: channel.topic,
            status,
          });
        }
      });

      channelRegistry.set(topic, entry);
    }

    entry.handlers.add(handleStockChange);
    channelRef.current = entry.channel;

    return () => {
      const currentEntry = channelRegistry.get(topic);
      if (!currentEntry) {
        return;
      }

      currentEntry.handlers.delete(handleStockChange);

      if (currentEntry.handlers.size === 0) {
        client.removeChannel(currentEntry.channel);
        channelRegistry.delete(topic);
      }

      if (channelRef.current === currentEntry.channel) {
        channelRef.current = null;
      }
    };
  }, [productId]);
}
