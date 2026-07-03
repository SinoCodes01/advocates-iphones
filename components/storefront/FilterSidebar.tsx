"use client";

import { X, Search } from "lucide-react";
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

const storageOptions = ["128GB", "256GB", "512GB", "1TB"];
const conditionOptions = [
  { label: "Brand New", value: "new" },
  { label: "Pre-Owned", value: "pre-owned" },
];

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
  const toggleItem = (list: string[], setList: (items: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return (
    <div className="flex flex-col gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between md:hidden">
        <h2 className="text-xl font-bold text-navy-900">Filters</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">
          Categories
        </h3>
        <div className="space-y-2">
          {categories.filter(c => c !== "All").map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => toggleItem(selectedCategories, setSelectedCategories, cat)}
                  className="w-5 h-5 border-2 border-gray-300 rounded text-brand-600 focus:ring-brand-500 cursor-pointer transition-colors checked:border-brand-600"
                />
              </div>
              <span className={`text-sm font-medium transition-colors ${
                selectedCategories.includes(cat) ? "text-navy-900" : "text-gray-600 group-hover:text-navy-700"
              }`}>
                {cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">
          Condition
        </h3>
        <div className="space-y-2">
          {conditionOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedConditions.includes(opt.value)}
                onChange={() => toggleItem(selectedConditions, setSelectedConditions, opt.value)}
                className="w-5 h-5 border-2 border-gray-300 rounded text-brand-600 focus:ring-brand-500 cursor-pointer transition-colors checked:border-brand-600"
              />
              <span className={`text-sm font-medium transition-colors ${
                selectedConditions.includes(opt.value) ? "text-navy-900" : "text-gray-600 group-hover:text-navy-700"
              }`}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">
          Storage
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {storageOptions.map((size) => (
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

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider mb-4">
          Price Range (R)
        </h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <span className="text-gray-400">—</span>
          <div className="flex-1">
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onClear}
        className="w-full py-3 text-sm font-bold text-gray-600 hover:text-navy-900 border border-gray-200 hover:border-gray-300 rounded-xl transition-all"
      >
        Clear All Filters
      </button>
    </div>
  );
}
