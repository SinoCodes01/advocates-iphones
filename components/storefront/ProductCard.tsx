import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice, conditionLabel } from "@/lib/utils";
import { ConditionBadge, StockBadge } from "@/components/ui/Badge";
import { Shield, Battery, Wifi } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`}>
      <div className="group bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-6xl font-bold text-gray-300">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <ConditionBadge condition={product.condition} />
            {product.condition !== "new" && product.batteryHealth && (
              <span className="bg-white/90 backdrop-blur-sm text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                <Battery className="w-3 h-3" />
                {product.batteryHealth}%
              </span>
            )}
          </div>

          {/* Stock badge */}
          <div className="absolute top-3 right-3">
            <StockBadge stock={product.stock} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="font-bold text-lg text-navy-900 mb-1 group-hover:text-brand-500 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            {product.storage && <span>{product.storage}</span>}
            {product.color && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: product.colorHex || "#ccc" }}
                  />
                  {product.color}
                </span>
              </>
            )}
          </div>

          {/* Price */}
          <div className="mt-auto">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-2xl font-bold text-navy-900">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-gray-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Warranty */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-brand-500" />
              <span>{product.warrantyMonths} month warranty</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}