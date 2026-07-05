"use client";

import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { categories } from "@/lib/mock-data";

interface FilterSidebarProps {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  selectedConditions: string[];
  setSelectedConditions: (conditions: string[]) => void;
  selectedStorage: string[];
  setSelectedStorage: (storage: string[]) => void;
  minPrice: string;
  setMinPrice: (price: string) => void;
  maxPrice: string;
  setMaxPrice: (price: string) => void;
  onClear: () => void;
  onClose?: () => void;
}

const STORAGE_OPTIONS = ["64GB", "128GB", "256GB", "512GB", "1TB"];
const CONDITION_OPTIONS = [
  { label: "Brand New", value: "new" },
  { label: "Pre-Owned", value: "pre-owned" },
];

// Price range constants (in Rands)
const PRICE_MIN = 0;
const PRICE_MAX = 50000;

export function FilterSidebar({
  selectedCategories,
  setSelectedCategories,
  selectedConditions,
  setSelectedConditions,
  selectedStorage,
  setSelectedStorage,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onClear,
  onClose,
}: FilterSidebarProps) {
  const minVal = minPrice ? Number(minPrice) : PRICE_MIN;
  const maxVal = maxPrice ? Number(maxPrice) : PRICE_MAX;

  // Track slider thumb order so they can cross
  const [localMin, setLocalMin] = useState(minVal);
  const [localMax, setLocalMax] = useState(maxVal);

  // Sync local state if parent resets
  useEffect(() => {
    setLocalMin(minPrice ? Number(minPrice) : PRICE_MIN);
    setLocalMax(maxPrice ? Number(maxPrice) : PRICE_MAX);
  }, [minPrice, maxPrice]);

  const handleMinChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(Number(e.target.value), localMax - 1000);
      setLocalMin(value);
      setMinPrice(value === PRICE_MIN ? "" : String(value));
    },
    [localMax, setMinPrice]
  );

  const handleMaxChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(Number(e.target.value), localMin + 1000);
      setLocalMax(value);
      setMaxPrice(value === PRICE_MAX ? "" : String(value));
    },
    [localMin, setMaxPrice]
  );

  const toggleItem = (list: string[], setList: (items: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const minPercent = ((localMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPercent = ((localMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const formatSliderPrice = (val: number) =>
    val >= 1000 ? `R${(val / 1000).toFixed(0)}k` : `R${val}`;

  return (
    <div className="flex flex-col gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      {/* Mobile close button */}
      <div className="flex items-center justify-between md:hidden">
        <h2 className="text-xl font-bold text-navy-900">Filters</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Model */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">Model</h3>
        <div className="space-y-2">
          {categories
            .filter((c) => c !== "All")
            .map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleItem(selectedCategories, setSelectedCategories, cat)}
                  className="w-5 h-5 border-2 border-gray-300 rounded text-brand-600 focus:ring-brand-500 cursor-pointer transition-colors checked:border-brand-600"
                />
                <span
                  className={`text-sm font-medium transition-colors ${
                    selectedCategories.includes(cat)
                      ? "text-navy-900"
                      : "text-gray-600 group-hover:text-navy-700"
                  }`}
                >
                  {cat}
                </span>
              </label>
            ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">Condition</h3>
        <div className="space-y-2">
          {CONDITION_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedConditions.includes(opt.value)}
                onChange={() => toggleItem(selectedConditions, setSelectedConditions, opt.value)}
                className="w-5 h-5 border-2 border-gray-300 rounded text-brand-600 focus:ring-brand-500 cursor-pointer transition-colors checked:border-brand-600"
              />
              <span
                className={`text-sm font-medium transition-colors ${
                  selectedConditions.includes(opt.value)
                    ? "text-navy-900"
                    : "text-gray-600 group-hover:text-navy-700"
                }`}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">Storage</h3>
        <div className="grid grid-cols-2 gap-2">
          {STORAGE_OPTIONS.map((size) => (
            <button
              key={size}
              onClick={() => toggleItem(selectedStorage, setSelectedStorage, size)}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                selectedStorage.includes(size)
                  ? "bg-navy-900 text-white border-navy-900 shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-5">
          Price Range
        </h3>

        {/* Price labels */}
        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-3">
          <span>{formatSliderPrice(localMin)}</span>
          <span>{formatSliderPrice(localMax)}</span>
        </div>

        {/* Dual range track */}
        <div className="relative h-1.5 mb-6">
          {/* Base track */}
          <div className="absolute inset-0 rounded-full bg-gray-200" />
          {/* Active fill */}
          <div
            className="absolute h-full rounded-full bg-brand-500 transition-all"
            style={{ left: `${minPercent}%`, right: `${100 - maxPercent}%` }}
          />

          {/* Min thumb */}
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={1000}
            value={localMin}
            onChange={handleMinChange}
            className="absolute w-full h-full appearance-none bg-transparent cursor-pointer range-thumb"
            style={{ zIndex: localMin > PRICE_MAX - 5000 ? 5 : 3 }}
          />
          {/* Max thumb */}
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={1000}
            value={localMax}
            onChange={handleMaxChange}
            className="absolute w-full h-full appearance-none bg-transparent cursor-pointer range-thumb"
            style={{ zIndex: 4 }}
          />
        </div>

        {/* Min / Max labels */}
        <div className="flex justify-between text-[11px] text-gray-400">
          <span>R0</span>
          <span>R50k</span>
        </div>
      </div>

      <button
        onClick={() => {
          setLocalMin(PRICE_MIN);
          setLocalMax(PRICE_MAX);
          onClear();
        }}
        className="w-full py-3 text-sm font-bold text-gray-600 hover:text-navy-900 border border-gray-200 hover:border-gray-300 rounded-xl transition-all"
      >
        Clear All Filters
      </button>
    </div>
  );
}
