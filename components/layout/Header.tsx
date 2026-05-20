"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, MapPin, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart";

export function Header() {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, getItemCount } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-navy-900 text-white text-sm py-2 hidden sm:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Cape Town, South Africa
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              073 561 7081
            </span>
          </div>
          <span className="text-brand-400 font-medium">
            Trusted iPhone Reseller
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-navy-700 to-brand-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <span className="font-bold text-xl text-navy-900">Advocates</span>
              <span className="text-brand-500 font-bold"> iPhones</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-navy-700 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-gray-700 hover:text-navy-700 font-medium transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/shop?condition=refurbished"
              className="text-gray-700 hover:text-navy-700 font-medium transition-colors"
            >
              Refurbished
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-navy-700 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 mt-4">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-navy-700 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-gray-700 hover:text-navy-700 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/shop?condition=refurbished"
                className="text-gray-700 hover:text-navy-700 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Refurbished
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-navy-700 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}