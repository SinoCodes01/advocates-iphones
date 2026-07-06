"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { FilterSidebar } from "@/components/storefront/FilterSidebar";
import { Product } from "@/lib/types";
import { queryKeys, fetchProducts } from "@/lib/queries";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";

const PAGE_SIZE = 12;

interface ShopClientProps {
  initialProducts: Product[];
}

export function ShopClient({ initialProducts }: ShopClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedConditions.length > 0 ||
    selectedStorage.length > 0 ||
    minPrice !== "" ||
    maxPrice !== "" ||
    searchQuery !== "";

  // Build query params object (memoised as string to stabilise the key)
  const queryParams: Record<string, string> = {
    limit: String(PAGE_SIZE),
    offset: String((page - 1) * PAGE_SIZE),
    ...(selectedCategories.length > 0 && { category: selectedCategories.join(",") }),
    ...(selectedConditions.length > 0 && { condition: selectedConditions.join(",") }),
    ...(selectedStorage.length > 0 && { storage: selectedStorage.join(",") }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    ...(searchQuery && { search: searchQuery }),
    ...(sortBy && { sort: sortBy }),
  };

  const { data: pageProducts, isFetching, isLoading } = useQuery({
    queryKey: queryKeys.products(queryParams),
    queryFn: () => fetchProducts(queryParams),
    // Only enable if filters are active OR we're past page 1
    enabled: hasActiveFilters || sortBy !== "featured" || page > 1,
    // Keep previous results visible while next page loads
    placeholderData: (prev) => prev,
    staleTime: 30 * 1000,
  });

  // Accumulate pages into allProducts
  useEffect(() => {
    if (!hasActiveFilters && sortBy === "featured" && page === 1) {
      setAllProducts(initialProducts);
      return;
    }
    if (pageProducts) {
      if (page === 1) {
        setAllProducts(pageProducts);
      } else {
        setAllProducts((prev) => {
          // Deduplicate by id in case of race conditions
          const ids = new Set(prev.map((p) => p.id));
          return [...prev, ...pageProducts.filter((p) => !ids.has(p.id))];
        });
      }
    }
  }, [pageProducts, page, hasActiveFilters, sortBy, initialProducts]);

  // Reset page on filter changes
  useEffect(() => {
    setPage(1);
    setAllProducts([]);
  }, [selectedCategories, selectedConditions, selectedStorage, minPrice, maxPrice, searchQuery, sortBy]);

  const hasMore =
    (pageProducts?.length ?? (page === 1 ? initialProducts.length : 0)) >= PAGE_SIZE;

  // ─── Infinite Scroll ──────────────────────────────────────────────────────
  const observerTarget = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  // Lock scroll when mobile filters open
  useEffect(() => {
    document.body.style.overflow = showMobileFilters ? "hidden" : "unset";
  }, [showMobileFilters]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setSelectedStorage([]);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setPage(1);
  };

  const availableCategories = Array.from(
    new Set(initialProducts.map((p) => p.category).filter(Boolean))
  ) as string[];

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
            availableCategories={availableCategories}
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
              {isLoading ? "Finding devices..." : `${allProducts.length} Device${allProducts.length !== 1 ? "s" : ""} Found`}
            </h2>
            {isFetching && <Loader2 className="w-5 h-5 text-brand-500 animate-spin" />}
          </div>

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
        {allProducts.length > 0 ? (
          <>
            <ProductGrid products={allProducts} />
            {hasMore && (
              <div ref={observerTarget} className="flex justify-center mt-8 py-4">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isFetching}
                  className="px-8 py-3 bg-navy-900 text-white rounded-xl font-bold hover:bg-navy-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {isFetching && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isFetching ? "Loading more..." : "Load More"}
                </button>
              </div>
            )}
          </>
        ) : !isLoading && (
          <div className="bg-white rounded-3xl border border-gray-100 py-24 px-8 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 mb-3">No matches found</h3>
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
              availableCategories={availableCategories}
            />
          </div>
        </div>
      )}
    </div>
  );
}
