"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Promotion, StoreSettings } from "@/lib/types";
import { queryKeys, fetchPromotions, fetchSettings } from "@/lib/queries";
import { Percent, Truck, Loader2, Save, Trash2, Plus, Megaphone } from "lucide-react";

export function AdminSettings() {
  const queryClient = useQueryClient();

  const [discountPercent, setDiscountPercent] = useState("");
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [newPromo, setNewPromo] = useState({ label: "", title: "", href: "", active: true, display_order: 0 });

  // ─── Queries ────────────────────────────────────────────────────────────────

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: queryKeys.settings,
    queryFn: fetchSettings,
  });

  const { data: promotions = [], isLoading: promosLoading } = useQuery({
    queryKey: queryKeys.promotions,
    queryFn: fetchPromotions,
    // Include inactive promos in admin view by overriding the shared fetcher
    select: (data) => data, // all promos (storefront filters active only)
  });

  // Local copy of settings for the controlled input
  const [localThreshold, setLocalThreshold] = useState<number | null>(null);
  const threshold = localThreshold ?? settings?.free_delivery_threshold ?? 0;

  const isLoading = settingsLoading || promosLoading;

  // ─── Mutations ──────────────────────────────────────────────────────────────

  const saveSettingsMutation = useMutation({
    mutationFn: async (free_delivery_threshold: number) => {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ free_delivery_threshold }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to save settings");
      return data;
    },
    onSuccess: () => {
      // Invalidate settings cache so storefront picks up new threshold instantly
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
      setLocalThreshold(null);
      alert("Settings saved!");
    },
    onError: (err: Error) => alert(err.message),
  });

  const bulkDiscountMutation = useMutation({
    mutationFn: async (discountPercentage: number) => {
      const res = await fetch("/api/admin/bulk-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountPercentage }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to apply discount");
      return data;
    },
    onSuccess: () => {
      // Invalidate product cache so new prices show on storefront
      queryClient.invalidateQueries({ queryKey: queryKeys.products() });
      setDiscountPercent("");
      alert("Bulk discount applied successfully!");
    },
    onError: (err: Error) => alert(err.message),
  });

  const createPromoMutation = useMutation({
    mutationFn: async (promo: typeof newPromo) => {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promo),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to create promotion");
      return data.promotion as Promotion;
    },
    // Optimistic update — UI updates instantly before the server confirms
    onMutate: async (newPromoData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.promotions });
      const previous = queryClient.getQueryData(queryKeys.promotions);
      queryClient.setQueryData(queryKeys.promotions, (old: Promotion[] = []) => [
        ...old,
        { ...newPromoData, id: `temp-${Date.now()}`, created_at: new Date().toISOString() },
      ]);
      return { previous };
    },
    // On error, roll back to the previous state
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.promotions, context.previous);
      alert("Error creating promotion");
    },
    // Always refetch after settlement to sync with DB
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.promotions });
      setIsAddingPromo(false);
      setNewPromo({ label: "", title: "", href: "", active: true, display_order: 0 });
    },
  });

  const deletePromoMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/promotions?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to delete promotion");
    },
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.promotions });
      const previous = queryClient.getQueryData(queryKeys.promotions);
      queryClient.setQueryData(queryKeys.promotions, (old: Promotion[] = []) =>
        old.filter((p) => p.id !== id)
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.promotions, context.previous);
      alert("Error deleting promotion");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.promotions }),
  });

  const togglePromoMutation = useMutation({
    mutationFn: async (promo: Promotion) => {
      const res = await fetch("/api/admin/promotions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: promo.id, active: !promo.active }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to update promotion");
      return data.promotion as Promotion;
    },
    // Optimistic toggle
    onMutate: async (promo) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.promotions });
      const previous = queryClient.getQueryData(queryKeys.promotions);
      queryClient.setQueryData(queryKeys.promotions, (old: Promotion[] = []) =>
        old.map((p) => (p.id === promo.id ? { ...p, active: !p.active } : p))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.promotions, context.previous);
      alert("Error updating promotion");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.promotions }),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Bulk Discounts */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center">
            <Percent className="w-5 h-5 text-brand-500" />
          </div>
          <h2 className="text-xl font-bold text-navy-900">Storewide Discount</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Apply a bulk percentage discount to all products. This will permanently update the prices and set the old prices as the &quot;compare at&quot; price.
        </p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="e.g. 10"
              className="pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 w-32 no-spinner"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
          </div>
          <Button
            onClick={() => {
              if (!discountPercent || isNaN(Number(discountPercent))) return;
              if (!confirm(`Apply a ${discountPercent}% discount to ALL products?`)) return;
              bulkDiscountMutation.mutate(Number(discountPercent));
            }}
            loading={bulkDiscountMutation.isPending}
          >
            Apply Discount
          </Button>
        </div>
      </div>

      {/* Store Settings */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <Truck className="w-5 h-5 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-navy-900">Delivery Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-navy-900 mb-2">
              Free Delivery Threshold (R)
            </label>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setLocalThreshold(e.target.value === "" ? 0 : Number(e.target.value))}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 w-64 block no-spinner"
            />
            <p className="text-xs text-gray-500 mt-1">Orders above this amount will have their delivery fee waived automatically.</p>
          </div>
          <Button
            onClick={() => saveSettingsMutation.mutate(threshold)}
            loading={saveSettingsMutation.isPending}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>

      {/* Promotions */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-xl font-bold text-navy-900">Sale Carousel Banners</h2>
          </div>
          <Button onClick={() => setIsAddingPromo(!isAddingPromo)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </div>

        {isAddingPromo && (
          <div className="mb-6 p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Label (e.g. Winter Sale)</label>
                <input
                  type="text"
                  value={newPromo.label}
                  onChange={(e) => setNewPromo({ ...newPromo, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Link (e.g. /shop)</label>
                <input
                  type="text"
                  value={newPromo.href}
                  onChange={(e) => setNewPromo({ ...newPromo, href: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title (e.g. Up to 12% off selected iPhones)</label>
                <input
                  type="text"
                  value={newPromo.title}
                  onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsAddingPromo(false)}>Cancel</Button>
              <Button
                size="sm"
                onClick={() => createPromoMutation.mutate(newPromo)}
                loading={createPromoMutation.isPending}
              >
                Save Banner
              </Button>
            </div>
          </div>
        )}

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Banner</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {promotions.map((promo) => (
                <tr key={promo.id} className={promo.id.startsWith("temp-") ? "opacity-60 animate-pulse" : ""}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-sm text-navy-900">{promo.label}</p>
                    <p className="text-xs text-gray-500">{promo.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePromoMutation.mutate(promo)} disabled={togglePromoMutation.isPending}>
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${promo.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {promo.active ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (!confirm("Delete this promotion?")) return;
                        deletePromoMutation.mutate(promo.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {promotions.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-gray-500 text-sm">No promotional banners found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}