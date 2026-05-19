"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { categories } from "@/lib/mock-data";
import { Product } from "@/lib/types";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "All") {
          params.append("category", selectedCategory);
        }
        if (selectedCondition) {
          params.append("condition", selectedCondition);
        }
        if (searchQuery) {
          params.append("search", searchQuery);
        }

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        if (data.success) {
          let sortedProducts = [...data.products];
          if (sortBy === "price-low") sortedProducts.sort((a, b) => a.price - b.price);
          else if (sortBy === "price-high") sortedProducts.sort((a, b) => b.price - a.price);
          else if (sortBy === "featured") sortedProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          
          setProducts(sortedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [selectedCategory, selectedCondition, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Shop iPhones</h1>
          <p className="text-gray-600">
            Browse our collection of premium iPhones
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search & Filter bar */}
        <div className="bg-white rounded-2xl shadow-card p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search iPhones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            {/* Filter button (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>

            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Filters */}
          <div className={`mt-4 pt-4 border-t ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="flex flex-wrap gap-4">
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === cat
                          ? "bg-navy-700 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCondition(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !selectedCondition
                        ? "bg-navy-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedCondition("new")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCondition === "new"
                        ? "bg-navy-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Brand New
                  </button>
                  <button
                    onClick={() => setSelectedCondition("refurbished")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCondition === "refurbished"
                        ? "bg-navy-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Refurbished
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {isLoading ? "Searching..." : `Showing ${products.length} product${products.length !== 1 ? "s" : ""}`}
          </p>
          {isLoading && <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />}
        </div>

        {/* Product grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : !isLoading && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedCondition(null);
              }}
              className="px-6 py-3 bg-navy-700 text-white rounded-xl font-medium hover:bg-navy-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}