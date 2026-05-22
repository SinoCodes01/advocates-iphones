"use client";

import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { X, Loader2, Save } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ProductForm({ product, onClose, onSuccess }: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: 0,
    compare_at_price: 0,
    stock_quantity: 0,
    condition: "new" as "new" | "refurbished" | "pre-owned",
    storage: "",
    color: "",
    color_hex: "",
    category: "",
    description: "",
    warranty_months: 12,
    battery_health: 100,
    active: true,
    featured: false,
    images: [] as string[],
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        slug: product.slug || "",
        price: product.price || 0,
        compare_at_price: (product as any).compare_at_price || product.compareAtPrice || 0,
        stock_quantity: product.stockQuantity || (product as any).stock_quantity || 0,
        condition: product.condition || "new",
        storage: product.storage || "",
        color: product.color || "",
        color_hex: (product as any).color_hex || product.colorHex || "",
        category: product.category || "",
        description: product.description || "",
        warranty_months: (product as any).warranty_months || product.warrantyMonths || 12,
        battery_health: (product as any).battery_health || product.batteryHealth || 100,
        active: product.active ?? true,
        featured: product.featured ?? false,
        images: product.images || [],
      });
    }
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Auto-generate slug from name if adding new product
    if (name === "name" && !product) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = "/api/products";
      const method = product ? "PATCH" : "POST";
      const body = product ? { id: product.id, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to save product. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-navy-900">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-sm text-gray-500">
              Fill in the details for the iPhone listing
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column - Core Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  placeholder="iPhone 15 Pro"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                  placeholder="iphone-15-pro"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Price (R) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="24999"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Compare Price
                  </label>
                  <input
                    type="number"
                    name="compare_at_price"
                    value={formData.compare_at_price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="27999"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    required
                    min="0"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white"
                  >
                    <option value="new">Brand New</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="pre-owned">Pre-Owned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
                  placeholder="Enter product details..."
                />
              </div>
            </div>

            {/* Right Column - Specs & Variants */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Storage
                  </label>
                  <input
                    type="text"
                    name="storage"
                    value={formData.storage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="256GB"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="iPhone 15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Color Name
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    placeholder="Titanium"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Color Hex
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="color_hex"
                      value={formData.color_hex}
                      onChange={handleChange}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl"
                      placeholder="#000000"
                    />
                    <div
                      className="w-12 h-12 rounded-xl border border-gray-200"
                      style={{ backgroundColor: formData.color_hex || "#eee" }}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Warranty (Months)
                  </label>
                  <input
                    type="number"
                    name="warranty_months"
                    value={formData.warranty_months}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-2">
                    Battery Health (%)
                  </label>
                  <input
                    type="number"
                    name="battery_health"
                    value={formData.battery_health}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-brand-500"
                  />
                  <span className="font-medium text-navy-900">Active (Visible in Store)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded text-brand-500"
                  />
                  <span className="font-medium text-navy-900">Featured on Homepage</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-navy-900 mb-2">
                  Product Images *
                </label>
                <ImageUpload
                  images={formData.images}
                  onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
                  productId={product?.id}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-4 sticky bottom-0 z-10">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            className="min-w-[140px]"
          >
            <Save className="w-5 h-5 mr-2" />
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
