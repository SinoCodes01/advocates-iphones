import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Promotion, StoreSettings } from "@/lib/types";
import { Percent, Truck, Loader2, Save, Trash2, Plus, Megaphone } from "lucide-react";

export function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Bulk discount state
  const [discountPercent, setDiscountPercent] = useState("");
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Promotions state
  const [isAddingPromo, setIsAddingPromo] = useState(false);
  const [newPromo, setNewPromo] = useState({ label: "", title: "", href: "", active: true, display_order: 0 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [settingsRes, promosRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/promotions")
      ]);
      const settingsData = await settingsRes.json();
      const promosData = await promosRes.json();

      if (settingsData.success) setSettings(settingsData.settings);
      if (promosData.success) setPromotions(promosData.promotions);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyBulkDiscount = async () => {
    if (!discountPercent || isNaN(Number(discountPercent))) return;
    if (!confirm(`Are you sure you want to apply a ${discountPercent}% discount to ALL products?`)) return;

    setIsApplyingDiscount(true);
    try {
      const res = await fetch("/api/admin/bulk-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountPercentage: Number(discountPercent) })
      });
      const data = await res.json();
      if (data.success) {
        alert("Bulk discount applied successfully!");
        setDiscountPercent("");
      } else {
        alert(data.error || "Failed to apply discount");
      }
    } catch (err) {
      alert("Error applying discount");
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ free_delivery_threshold: Number(settings.free_delivery_threshold) })
      });
      const data = await res.json();
      if (data.success) alert("Settings saved!");
      else alert(data.error || "Failed to save settings");
    } catch (err) {
      alert("Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreatePromo = async () => {
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPromo)
      });
      const data = await res.json();
      if (data.success) {
        setPromotions([...promotions, data.promotion]);
        setIsAddingPromo(false);
        setNewPromo({ label: "", title: "", href: "", active: true, display_order: 0 });
      } else {
        alert(data.error || "Failed to create promotion");
      }
    } catch (err) {
      alert("Error creating promotion");
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (!confirm("Delete this promotion?")) return;
    try {
      const res = await fetch(`/api/admin/promotions?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setPromotions(promotions.filter(p => p.id !== id));
      } else {
        alert(data.error || "Failed to delete promotion");
      }
    } catch (err) {
      alert("Error deleting promotion");
    }
  };

  const handleTogglePromo = async (promo: Promotion) => {
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: promo.id, active: !promo.active })
      });
      const data = await res.json();
      if (data.success) {
        setPromotions(promotions.map(p => p.id === promo.id ? { ...p, active: !p.active } : p));
      } else {
        alert(data.error || "Failed to update promotion");
      }
    } catch (err) {
      alert("Error updating promotion");
    }
  };

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
              className="pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 w-32"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">%</span>
          </div>
          <Button onClick={handleApplyBulkDiscount} loading={isApplyingDiscount}>
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
              value={settings?.free_delivery_threshold || 0}
              onChange={(e) => setSettings(prev => prev ? { ...prev, free_delivery_threshold: Number(e.target.value) } : null)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 w-64 block"
            />
            <p className="text-xs text-gray-500 mt-1">Orders above this amount will have their delivery fee waived automatically.</p>
          </div>
          <Button onClick={handleUpdateSettings} loading={isSaving}>
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
                  onChange={e => setNewPromo({...newPromo, label: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Link (e.g. /shop)</label>
                <input 
                  type="text" 
                  value={newPromo.href} 
                  onChange={e => setNewPromo({...newPromo, href: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">Title (e.g. Up to 12% off selected iPhones)</label>
                <input 
                  type="text" 
                  value={newPromo.title} 
                  onChange={e => setNewPromo({...newPromo, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsAddingPromo(false)}>Cancel</Button>
              <Button size="sm" onClick={handleCreatePromo}>Save Banner</Button>
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
              {promotions.map(promo => (
                <tr key={promo.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-sm text-navy-900">{promo.label}</p>
                    <p className="text-xs text-gray-500">{promo.title}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleTogglePromo(promo)}>
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {promo.active ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDeletePromo(promo.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
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
