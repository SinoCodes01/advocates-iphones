"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, calculateDiscountPercentage } from "@/lib/utils";
import { ConditionBadge, StockBadge } from "@/components/ui/Badge";
import { Shield, Battery, ShoppingBag } from "lucide-react";
import { useRealtimeProductStock } from "./useRealtimeProductStock";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);
  const [currentStockQuantity, setCurrentStockQuantity] = useState(product.stockQuantity);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentStockQuantity(product.stockQuantity);
  }, [product.stockQuantity]);

  const handleStockChange = useCallback((stockQuantity: number) => {
    setCurrentStockQuantity(stockQuantity);
  }, []);

  useRealtimeProductStock(product.id, handleStockChange);

  return (
    <Link href={`/product/${product.slug}`} className="block h-full group">
      <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-glow transition-all duration-500 overflow-hidden h-full flex flex-col relative">
        {/* Image Container */}
        <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-gray-50">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-2xl sm:text-4xl font-black text-gray-200 uppercase tracking-tighter italic">Advocates</span>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 flex flex-col gap-1 sm:gap-2 z-10">
            <ConditionBadge condition={product.condition} className="text-[9px] sm:text-xs" />
            {product.compareAtPrice != null && Number(product.compareAtPrice) > 0 && Number(product.compareAtPrice) > product.price && (
              <span className="bg-brand-500 text-white text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg uppercase tracking-wider w-fit">
                -{calculateDiscountPercentage(product.price, Number(product.compareAtPrice))}% OFF
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 scale-90 sm:scale-100 origin-top-right">
            <StockBadge stockQuantity={currentStockQuantity} />
          </div>

          {/* Battery Health Overlay */}
          {product.condition !== "new" && product.batteryHealth && (
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10">
              <span className="bg-navy-900/80 backdrop-blur-md text-white text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg flex items-center gap-1 border border-white/10">
                <Battery className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-400" />
                {product.batteryHealth}% HEALTH
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 sm:p-6 flex flex-col flex-1">
          <div className="mb-2">
            <h3 className="font-black text-sm sm:text-xl text-navy-900 leading-tight group-hover:text-brand-500 transition-colors line-clamp-2 sm:line-clamp-none">
              {product.name}
            </h3>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
              <span className="text-[9px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">
                {product.storage || "64GB"}
              </span>
              <span className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-[9px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase">
                {product.color || "Space Gray"}
              </span>
            </div>
          </div>

          {/* Price & Warranty */}
          <div className="mt-auto pt-3 sm:pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                {product.compareAtPrice != null && Number(product.compareAtPrice) > 0 && Number(product.compareAtPrice) > product.price && (
                  <div className="text-[10px] sm:text-xs font-bold text-gray-400 line-through decoration-gray-400 mb-0.5">
                    {mounted ? formatPrice(Number(product.compareAtPrice)) : "..."}
                  </div>
                )}
                <div className="text-lg sm:text-2xl font-black text-navy-900 leading-none">
                  {mounted ? formatPrice(product.price) : "..."}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-brand-500 flex-shrink-0" />
                  <span className="text-[8px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
                    {product.warrantyMonths} Mo. Warranty
                  </span>
                </div>
              </div>
              
              <div className="w-9 h-9 sm:w-12 sm:h-12 bg-navy-900 rounded-lg sm:rounded-2xl flex items-center justify-center group-hover:bg-brand-500 transition-all duration-300 shadow-lg shadow-navy-900/10 group-hover:shadow-brand-500/25 group-hover:-translate-y-1 flex-shrink-0">
                <ShoppingBag className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}