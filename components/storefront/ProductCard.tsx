"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, conditionLabel, calculateDiscountPercentage } from "@/lib/utils";
import { ConditionBadge, StockBadge } from "@/components/ui/Badge";
import { Shield, Battery, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("DEBUG: ProductCard", { name: product.name, price: product.price, compareAtPrice: product.compareAtPrice });
  }, [product]);

  return (
    <Link href={`/product/${product.slug}`} className="block h-full group">
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-glow transition-all duration-500 overflow-hidden h-full flex flex-col relative">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-4xl font-black text-gray-200 uppercase tracking-tighter italic">Advocates</span>
            </div>
          )}

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <ConditionBadge condition={product.condition} />
            {product.compareAtPrice != null && Number(product.compareAtPrice) > 0 && Number(product.compareAtPrice) > product.price && (
              <span className="bg-brand-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-wider">
                -{calculateDiscountPercentage(product.price, Number(product.compareAtPrice))}% OFF
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="absolute top-4 right-4 z-10">
            <StockBadge stock={product.stock} />
          </div>

          {/* Battery Health Overlay */}
          {product.condition !== "new" && product.batteryHealth && (
            <div className="absolute bottom-4 left-4 z-10">
              <span className="bg-navy-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 border border-white/10">
                <Battery className="w-3 h-3 text-brand-400" />
                {product.batteryHealth}% HEALTH
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-2">
            <h3 className="font-black text-xl text-navy-900 leading-tight group-hover:text-brand-500 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                {product.storage || "64GB"}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">
                {product.color || "Space Gray"}
              </span>
            </div>
          </div>

          {/* Price & Warranty */}
          <div className="mt-auto pt-4 flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-navy-900">
                  {mounted ? formatPrice(product.price) : "..."}
                </span>
                {product.compareAtPrice != null && Number(product.compareAtPrice) > 0 && Number(product.compareAtPrice) > product.price && (
                  <span className="text-sm font-bold text-gray-400 line-through decoration-gray-400">
                    {mounted ? formatPrice(Number(product.compareAtPrice)) : "..."}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Shield className="w-3 h-3 text-brand-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                  {product.warrantyMonths} Months Warranty
                </span>
              </div>
            </div>
            
            <div className="w-10 h-10 bg-navy-900 rounded-xl flex items-center justify-center group-hover:bg-brand-500 transition-colors shadow-lg shadow-navy-900/10 group-hover:shadow-brand-500/20">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}