"use client";

import Image from "next/image";
import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { ConditionBadge, StockBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Product } from "@/lib/types";
import {
  Shield,
  Battery,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageCircle,
} from "lucide-react";

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
  };

  const images = product.images && product.images.length > 0 ? product.images : [];

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Image gallery */}
      <div className="space-y-4">
        <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-card">
          {images[selectedImageIndex] ? (
            <Image
              src={images[selectedImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-8xl font-bold text-gray-300">
                {product.name.charAt(0)}
              </span>
            </div>
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  setSelectedImageIndex((i) =>
                    i === 0 ? images.length - 1 : i - 1
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() =>
                  setSelectedImageIndex((i) =>
                    i === images.length - 1 ? 0 : i + 1
                  )
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors flex-shrink-0 ${
                  selectedImageIndex === index
                    ? "border-brand-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="space-y-6">
        {/* Title & badges */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <ConditionBadge condition={product.condition} />
            <StockBadge stock={product.stock} />
          </div>
          <h1 className="text-3xl font-bold text-navy-900">{product.name}</h1>
          {product.storage && (
            <p className="text-lg text-gray-600 mt-1">{product.storage}</p>
          )}
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-navy-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="inline-block bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              Save {formatPrice(product.compareAtPrice - product.price)}
            </span>
          )}
        </div>

        {/* Color */}
        {product.color && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
            <div className="flex items-center gap-3">
              <span
                className="w-8 h-8 rounded-full border-2 border-gray-200"
                style={{ backgroundColor: product.colorHex || "#ccc" }}
              />
              <span className="text-gray-900">{product.color}</span>
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Quantity</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <span className="px-4 py-3 font-medium min-w-[60px] text-center border-x border-gray-100">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="px-4 py-3 hover:bg-gray-100 transition-colors"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {product.stock} available
            </span>
          </div>
        </div>

        {/* Add to cart */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleAddToCart}
            size="lg"
            className="flex-1"
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27735617081"}?text=Hi Advocates iPhones! I'm interested in the ${product.name} ${product.storage || ""}. Is it still available?`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="flex-1 w-full">
              <MessageCircle className="w-5 h-5 mr-2" />
              Ask on WhatsApp
            </Button>
          </a>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-brand-500" />
            <div>
              <p className="font-medium text-gray-900">
                {product.warrantyMonths} Month Warranty
              </p>
              <p className="text-sm text-gray-500">Parts & labor covered</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-brand-500" />
            <div>
              <p className="font-medium text-gray-900">Nationwide Delivery</p>
              <p className="text-sm text-gray-500">2-5 business days</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-brand-500" />
            <div>
              <p className="font-medium text-gray-900">7-Day Returns</p>
              <p className="text-sm text-gray-500">Money-back guarantee</p>
            </div>
          </div>
          {product.batteryHealth && (
            <div className="flex items-center gap-3">
              <Battery className="w-5 h-5 text-brand-500" />
              <div>
                <p className="font-medium text-gray-900">
                  Battery Health: {product.batteryHealth}%
                </p>
                <p className="text-sm text-gray-500">Tested & verified</p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="pt-6 border-t">
            <h2 className="font-semibold text-lg text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}

        {/* Authenticity guarantee */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-6 h-6 text-brand-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                100% Authentic Guarantee
              </h3>
              <p className="text-sm text-gray-600">
                Every iPhone is 100% genuine. We verify all devices before
                shipping and only source from authorized channels. Your
                satisfaction is our priority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
