"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/storefront/Hero";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { Product } from "@/lib/types";

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [featuredRes, newRes] = await Promise.all([
          fetch("/api/products?featured=true"),
          fetch("/api/products"),
        ]);

        const featuredData = await featuredRes.json();
        const newData = await newRes.json();

        if (featuredData.success) setFeaturedProducts(featuredData.products);
        if (newData.success) setNewArrivals(newData.products.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div>
      <Hero />
      
      {isLoading ? (
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          {featuredProducts.length > 0 && (
            <ProductGrid products={featuredProducts} title="Featured Products" />
          )}
        </>
      )}

      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">
              Why Choose Advocates iPhones?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are committed to providing the best iPhone buying experience in
              South Africa.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-card text-center border border-gray-100">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-brand-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                100% Authentic
              </h3>
              <p className="text-gray-600">
                Every iPhone is verified for authenticity. We source directly from
                authorized channels to ensure you get the real deal.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card text-center border border-gray-100">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-brand-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                Warranty Included
              </h3>
              <p className="text-gray-600">
                All devices come with a comprehensive warranty. Any manufacturing
                defects are covered for peace of mind.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-card text-center border border-gray-100">
              <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-brand-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-3">
                WhatsApp Support
              </h3>
              <p className="text-gray-600">
                Get instant answers via WhatsApp. We believe in direct,
                personal communication with our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {!isLoading && newArrivals.length > 0 && (
        <ProductGrid products={newArrivals} title="New Arrivals" />
      )}
    </div>
  );
}