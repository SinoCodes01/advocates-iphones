"use client";

import { useEffect, useState } from "react";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { FilterSidebar } from "@/components/storefront/FilterSidebar";
import { Product } from "@/lib/types";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";

interface ShopClientProps {
  initialProducts: Product[];
}

export function ShopClient({ initialProducts }: ShopClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // We only fetch client-side if filters are active
  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedConditions.length > 0 || 
    selectedStorage.length > 0 || 
    minPrice !== "" || 
    maxPrice !== "" || 
    searchQuery !== "";

  useEffect(() => {
    if (!hasActiveFilters && sortBy === "featured") {
      setProducts(initialProducts);
      return;
    }

    async function fetchProducts() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (selectedCategories.length > 0) {
          params.append("category", selectedCategories.join(","));
        }
        if (selectedConditions.length > 0) {
          params.append("condition", selectedConditions.join(","));
        }
        if (selectedStorage.length > 0) {
          params.append("storage", selectedStorage.join(","));
        }
        if (minPrice) {
          params.append("minPrice", minPrice);
        }
        if (maxPrice) {
          params.append("maxPrice", maxPrice);
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
  }, [selectedCategories, selectedConditions, selectedStorage, minPrice, maxPrice, searchQuery, sortBy, hasActiveFilters, initialProducts]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setSelectedStorage([]);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24">
          <FilterSidebar
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedConditions={selectedConditions}
            setSelectedConditions={setSelectedConditions}
            selectedStorage={selectedStorage}
            setSelectedStorage={setSelectedStorage}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onClear={clearFilters}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by model, color, or storage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-brand-500 transition-all text-navy-900 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-5 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-navy-900 hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-5 py-3.5 bg-white border border-gray-200 rounded-xl font-bold text-navy-900 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer hover:bg-gray-50 transition-colors appearance-none min-w-[160px]"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-navy-900">
              {isLoading ? "Finding devices..." : `${products.length} Device${products.length !== 1 ? "s" : ""} Found`}
            </h2>
            {isLoading && <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />}
          </div>
          
          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="text-sm font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4"
            >
              Reset all
            </button>
          )}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : !isLoading && (
          <div className="bg-white rounded-3xl border border-gray-100 py-24 px-8 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-3">
              No matches found
            </h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              We couldn&apos;t find any iPhones matching your current filters. Try broadening your search.
            </p>
            <button
              onClick={clearFilters}
              className="px-8 py-4 bg-navy-900 text-white rounded-2xl font-bold hover:bg-navy-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <FilterSidebar
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedConditions={selectedConditions}
              setSelectedConditions={setSelectedConditions}
              selectedStorage={selectedStorage}
              setSelectedStorage={setSelectedStorage}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onClear={clearFilters}
              onClose={() => setShowMobileFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
