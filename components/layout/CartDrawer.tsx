"use client";

import { X, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice, cn } from "@/lib/utils";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState<number | null>(null);
  const { items, isOpen, closeCart, updateQuantity, removeItem, getSubtotal } =
    useCartStore();

  useEffect(() => {
    setMounted(true);
    
    // Fetch free delivery threshold
    const fetchSettings = async () => {
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/settings?t=${timestamp}`, { cache: 'no-store' });
        const data = await res.json();
        if (data.success && data.settings) {
          setFreeDeliveryThreshold(data.settings.free_delivery_threshold);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      }
    };
    fetchSettings();
  }, []);

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const progressToFreeDelivery = freeDeliveryThreshold ? Math.min((subtotal / freeDeliveryThreshold) * 100, 100) : 0;
  const remainingForFreeDelivery = freeDeliveryThreshold ? Math.max(freeDeliveryThreshold - subtotal, 0) : 0;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transition-transform duration-300 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-navy-700" />
            <h2 className="font-bold text-xl text-navy-900">Your Cart</h2>
            <span className="bg-brand-500 text-white text-xs px-2 py-1 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Free Delivery Progress (only if threshold is set and > 0) */}
        {freeDeliveryThreshold ? (
          <div className="bg-brand-50 px-6 py-4 border-b border-brand-100">
            <div className="flex justify-between text-sm font-bold text-navy-900 mb-2">
              <span>{remainingForFreeDelivery === 0 ? "🎉 Free Delivery Unlocked!" : `Only ${formatPrice(remainingForFreeDelivery)} away from free delivery!`}</span>
            </div>
            <div className="w-full bg-brand-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-brand-500 h-1.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressToFreeDelivery}%` }}
              ></div>
            </div>
          </div>
        ) : null}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Browse our collection and add something you love.
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="bg-navy-700 hover:bg-navy-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">

                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-300">
                          {item.product.name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {item.product.name}
                    </h3>
                    {item.product.storage && (
                      <p className="text-sm text-gray-500">
                        {item.product.storage}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="font-bold text-navy-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-sm text-red-500 hover:text-red-600 mt-2 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-2xl font-bold text-navy-900">
                {formatPrice(subtotal)}
              </span>
            </div>
            {!freeDeliveryThreshold && (
              <p className="text-sm text-gray-500">
                Delivery calculated at checkout
              </p>
            )}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-gradient-to-r from-navy-700 to-brand-500 hover:from-navy-800 hover:to-brand-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              Checkout
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}