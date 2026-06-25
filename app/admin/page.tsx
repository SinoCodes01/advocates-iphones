"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Product, Order } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";
import { OrderSlideOver } from "@/components/admin/OrderSlideOver";
import { AdminCharts } from "@/components/admin/AdminCharts";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  LogOut,
  BarChart3,
  Loader2,
  Search,
  X,
  CheckSquare,
  Square,
  RefreshCw,
  Bell,
  DollarSign,
  Filter,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Tab = "dashboard" | "products" | "orders";

const ORDER_STATUSES = [
  "all",
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const STATUS_BADGE_VARIANT: Record<string, any> = {
  pending: "warning",
  confirmed: "info",
  packed: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "default",
};

const STATUS_DOT: Record<string, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-blue-400",
  packed: "bg-purple-400",
  shipped: "bg-indigo-400",
  delivered: "bg-green-400",
  cancelled: "bg-red-400",
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Product form/modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Order slide-over state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [slideOverOpen, setSlideOverOpen] = useState(false);
  const [slideOverStatus, setSlideOverStatus] = useState<string>("pending");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Search & filter state
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderDateFrom, setOrderDateFrom] = useState("");
  const [orderDateTo, setOrderDateTo] = useState("");
  const [productSearch, setProductSearch] = useState("");

  // Bulk select state — orders
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());
  const [bulkOrderStatus, setBulkOrderStatus] = useState("confirmed");
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Bulk select state — products
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [isBulkDeletingProducts, setIsBulkDeletingProducts] = useState(false);

  // New orders notification
  const [newOrderCount, setNewOrderCount] = useState(0);
  const prevOrderCountRef = useRef<number>(0);

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) return;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUser(session.user);
        fetchData();
      }
    };
    checkUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      if (productsData.success) setProducts(productsData.products);
      if (ordersData.success) {
        const newOrders: Order[] = ordersData.orders;
        setOrders(newOrders);
        const currentPendingCount = newOrders.filter(
          (o) => o.status === "pending"
        ).length;
        if (
          prevOrderCountRef.current > 0 &&
          currentPendingCount > prevOrderCountRef.current
        ) {
          setNewOrderCount(
            (prev) => prev + currentPendingCount - prevOrderCountRef.current
          );
        }
        prevOrderCountRef.current = currentPendingCount;
      }
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Poll for new orders every 60s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Re-fetch when tab changes
  useEffect(() => {
    if (user) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ── Order actions ──────────────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        // Sync slide-over if it's open for this order
        if (selectedOrder?.id === orderId) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, status: newStatus as any } : prev
          );
        }
      } else {
        alert(data.error || "Failed to update order status");
      }
    } catch {
      alert("An error occurred while updating the order status");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleBulkOrderUpdate = async () => {
    if (selectedOrderIds.size === 0) return;
    if (
      !confirm(
        `Update ${selectedOrderIds.size} orders to "${bulkOrderStatus}"?`
      )
    )
      return;
    setIsBulkUpdating(true);
    try {
      await Promise.all(
        Array.from(selectedOrderIds).map((id) =>
          fetch("/api/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status: bulkOrderStatus }),
          })
        )
      );
      setSelectedOrderIds(new Set());
      await fetchData();
    } catch {
      alert("Some updates may have failed.");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // ── Product actions ────────────────────────────────────────────────
  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) fetchData();
      else alert(data.error || "Failed to delete product");
    } catch {
      alert("An error occurred while deleting the product");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id, active: !product.active }),
      });
      const data = await res.json();
      if (data.success) fetchData();
      else alert(data.error || "Failed to update product status");
    } catch {
      alert("An error occurred while updating the product status");
    }
  };

  const handleBulkDeleteProducts = async () => {
    if (selectedProductIds.size === 0) return;
    if (
      !confirm(
        `Permanently delete ${selectedProductIds.size} product(s)? This cannot be undone.`
      )
    )
      return;
    setIsBulkDeletingProducts(true);
    try {
      await Promise.all(
        Array.from(selectedProductIds).map((id) =>
          fetch(`/api/products?id=${id}`, { method: "DELETE" })
        )
      );
      setSelectedProductIds(new Set());
      await fetchData();
    } catch {
      alert("Some deletions may have failed.");
    } finally {
      setIsBulkDeletingProducts(false);
    }
  };

  // ── Derived / filtered data ────────────────────────────────────────
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const filteredOrders = orders.filter((o) => {
    const search = orderSearch.toLowerCase();
    const matchSearch =
      !search ||
      o.orderNumber?.toLowerCase().includes(search) ||
      o.customerName?.toLowerCase().includes(search) ||
      o.phone?.toLowerCase().includes(search);
    const matchStatus =
      orderStatusFilter === "all" || o.status === orderStatusFilter;
    const orderDate = new Date(o.createdAt);
    const matchFrom = !orderDateFrom || orderDate >= new Date(orderDateFrom);
    const matchTo =
      !orderDateTo ||
      orderDate <=
        (() => {
          const d = new Date(orderDateTo);
          d.setHours(23, 59, 59, 999);
          return d;
        })();
    return matchSearch && matchStatus && matchFrom && matchTo;
  });

  const filteredProducts = products.filter((p) => {
    const search = productSearch.toLowerCase();
    return (
      !search ||
      p.name?.toLowerCase().includes(search) ||
      p.category?.toLowerCase().includes(search) ||
      p.storage?.toLowerCase().includes(search) ||
      p.color?.toLowerCase().includes(search)
    );
  });

  // ── Helpers ────────────────────────────────────────────────────────
  const toggleOrderSelect = (id: string) => {
    setSelectedOrderIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllOrders = () => {
    if (selectedOrderIds.size === filteredOrders.length) {
      setSelectedOrderIds(new Set());
    } else {
      setSelectedOrderIds(new Set(filteredOrders.map((o) => o.id)));
    }
  };

  const toggleProductSelect = (id: string) => {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllProducts = () => {
    if (selectedProductIds.size === filteredProducts.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(filteredProducts.map((p) => p.id)));
    }
  };

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setSlideOverStatus(order.status);
    setSlideOverOpen(true);
  };

  // ── Loading state ──────────────────────────────────────────────────
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-brand-500 animate-spin" />
          <p className="text-gray-500 font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Sticky Header ─────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-navy-900 text-white border-b border-navy-800 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Brand */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-white font-extrabold text-sm">A</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold leading-tight">
                  Advocates Admin
                </h1>
                <p className="text-navy-400 text-xs truncate">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Notification bell */}
              <button
                onClick={() => {
                  setNewOrderCount(0);
                  setActiveTab("orders");
                  setOrderStatusFilter("pending");
                }}
                className="relative p-2 rounded-xl hover:bg-white/10 transition-colors"
                title="Pending orders"
              >
                <Bell className="w-5 h-5" />
                {(pendingOrders > 0 || newOrderCount > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                    {pendingOrders}
                  </span>
                )}
              </button>

              <button
                onClick={() => fetchData()}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>

              <Link
                href="/"
                className="hidden sm:flex items-center gap-2 text-navy-300 hover:text-white transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                View Store
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-navy-300 hover:text-white transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex gap-1 pb-1">
            {(
              [
                { tab: "dashboard", icon: <BarChart3 className="w-4 h-4" />, label: "Dashboard", badge: undefined },
                { tab: "products", icon: <Package className="w-4 h-4" />, label: "Products", badge: undefined },
                { tab: "orders", icon: <ShoppingBag className="w-4 h-4" />, label: "Orders", badge: pendingOrders },
              ] as const
            ).map(({ tab, icon, label, badge }) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as Tab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-medium text-sm transition-all whitespace-nowrap relative ${
                  activeTab === tab
                    ? "bg-slate-50 text-navy-900"
                    : "text-navy-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {icon}
                {label}
                {badge != null && badge > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Page Body ─────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 py-8">

        {/* ── Dashboard Tab ─────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stat cards */}
            {/* Animated stat cards removed – component retained for future use */}

            {/* Analytics Charts */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="text-lg font-bold text-navy-900 mb-6">
                Analytics
              </h2>
              <AdminCharts orders={orders} products={products} />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-navy-900">Recent Orders</h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-brand-500 hover:text-brand-600 font-semibold text-sm transition-colors"
                >
                  View all →
                </button>
              </div>
              {orders.length > 0 ? (
                <div className="divide-y divide-gray-50">
                  {orders.slice(0, 6).map((order, i) => (
                    <button
                      key={order.id}
                      onClick={() => openOrderDetail(order)}
                      className={`w-full flex items-center justify-between px-6 py-4 hover:bg-brand-50/50 transition-colors text-left ${
                        i % 2 === 1 ? "bg-gray-50/60" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            STATUS_DOT[order.status] || "bg-gray-300"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {order.customerName} •{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                        <span className="font-bold text-gray-900 text-sm">
                          {formatPrice(order.total)}
                        </span>
                        <Badge variant={STATUS_BADGE_VARIANT[order.status] || "default"}>
                          {order.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-gray-400">No orders yet</p>
              )}
            </div>
          </div>
        )}

        {/* ── Products Tab ──────────────────────────────────────── */}
        {activeTab === "products" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products…"
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
                {productSearch && (
                  <button
                    onClick={() => setProductSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Bulk actions */}
              {selectedProductIds.size > 0 && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                  <span className="text-sm font-semibold text-red-700">
                    {selectedProductIds.size} selected
                  </span>
                  <Button
                    size="sm"
                    onClick={handleBulkDeleteProducts}
                    loading={isBulkDeletingProducts}
                    className="bg-red-600 hover:bg-red-700 text-white border-0"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              )}

              <Button
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Product count */}
            <p className="text-sm text-gray-500">
              {filteredProducts.length} of {products.length} products
            </p>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-navy-900 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left w-12">
                          <button
                            onClick={toggleAllProducts}
                            className="flex items-center text-white/70 hover:text-white"
                          >
                            {selectedProductIds.size === filteredProducts.length &&
                            filteredProducts.length > 0 ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200">
                          Product
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200">
                          Price
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200">
                          Stock
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200">
                          Status
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center py-16 text-gray-400"
                          >
                            No products found
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product, i) => (
                          <tr
                            key={product.id}
                            className={`hover:bg-brand-50/40 transition-colors ${
                              i % 2 === 1 ? "bg-gray-50/60" : "bg-white"
                            } ${
                              selectedProductIds.has(product.id)
                                ? "bg-brand-50"
                                : ""
                            }`}
                          >
                            <td className="px-4 py-3">
                              <button
                                onClick={() => toggleProductSelect(product.id)}
                                className="text-gray-400 hover:text-brand-500"
                              >
                                {selectedProductIds.has(product.id) ? (
                                  <CheckSquare className="w-4 h-4 text-brand-500" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                  {product.images?.[0] ? (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                      {product.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {product.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {[product.storage, product.color]
                                      .filter(Boolean)
                                      .join(" • ")}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                              {formatPrice(product.price)}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={
                                  product.stockQuantity <= 0
                                    ? "text-red-500 font-semibold"
                                    : product.stockQuantity <= 3
                                    ? "text-amber-600 font-semibold"
                                    : "text-gray-600"
                                }
                              >
                                {product.stockQuantity <= 0
                                  ? "Out of stock"
                                  : `${product.stockQuantity} in stock`}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleToggleActive(product)}
                                className="focus:outline-none"
                                title={
                                  product.active
                                    ? "Click to deactivate"
                                    : "Click to activate"
                                }
                              >
                                <Badge
                                  variant={product.active ? "success" : "default"}
                                >
                                  {product.active ? "Active" : "Inactive"}
                                </Badge>
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setIsFormOpen(true);
                                  }}
                                  className="p-2 rounded-xl hover:bg-brand-50 hover:text-brand-600 transition-colors text-gray-500"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors text-gray-500"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Orders Tab ────────────────────────────────────────── */}
        {activeTab === "orders" && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Search & Filter bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
              <div className="flex flex-wrap gap-3 items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order #, name, or phone…"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status filter */}
                <div className="flex items-center gap-1">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium capitalize"
                  >
                    {ORDER_STATUSES.map((s) => (
                      <option key={s} value={s} className="capitalize">
                        {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date range */}
              <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                <span className="font-medium">Date:</span>
                <input
                  type="date"
                  value={orderDateFrom}
                  onChange={(e) => setOrderDateFrom(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
                <span className="text-gray-400">to</span>
                <input
                  type="date"
                  value={orderDateTo}
                  onChange={(e) => setOrderDateTo(e.target.value)}
                  className="border border-gray-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                />
                {(orderDateFrom || orderDateTo) && (
                  <button
                    onClick={() => {
                      setOrderDateFrom("");
                      setOrderDateTo("");
                    }}
                    className="text-red-400 hover:text-red-600 text-xs font-medium"
                  >
                    Clear dates
                  </button>
                )}
              </div>
            </div>

            {/* Bulk action bar */}
            {selectedOrderIds.size > 0 && (
              <div className="flex flex-wrap items-center gap-3 bg-brand-50 border border-brand-200 rounded-2xl px-5 py-3">
                <span className="text-sm font-semibold text-brand-700">
                  {selectedOrderIds.size} order{selectedOrderIds.size > 1 ? "s" : ""} selected
                </span>
                <select
                  value={bulkOrderStatus}
                  onChange={(e) => setBulkOrderStatus(e.target.value)}
                  className="text-sm border border-brand-200 rounded-xl px-3 py-1.5 bg-white focus:ring-2 focus:ring-brand-500 outline-none font-medium"
                >
                  {ORDER_STATUSES.filter((s) => s !== "all").map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <Button
                  size="sm"
                  onClick={handleBulkOrderUpdate}
                  loading={isBulkUpdating}
                >
                  Apply to selected
                </Button>
                <button
                  onClick={() => setSelectedOrderIds(new Set())}
                  className="text-sm text-gray-500 hover:text-gray-700 ml-auto"
                >
                  Clear selection
                </button>
              </div>
            )}

            {/* Order count */}
            <p className="text-sm text-gray-500">
              {filteredOrders.length} of {orders.length} orders
            </p>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-navy-900 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left w-12">
                          <button
                            onClick={toggleAllOrders}
                            className="flex items-center text-white/70 hover:text-white"
                          >
                            {selectedOrderIds.size === filteredOrders.length &&
                            filteredOrders.length > 0 ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200">
                          Order
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200 hidden sm:table-cell">
                          Customer
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200 hidden md:table-cell">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200">
                          Total
                        </th>
                        <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200">
                          Status
                        </th>
                        <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-navy-200">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="text-center py-16 text-gray-400"
                          >
                            No orders match your filters
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order, i) => (
                          <tr
                            key={order.id}
                            className={`hover:bg-brand-50/40 transition-colors cursor-pointer ${
                              i % 2 === 1 ? "bg-gray-50/60" : "bg-white"
                            } ${
                              selectedOrderIds.has(order.id)
                                ? "bg-brand-50"
                                : ""
                            }`}
                            onClick={() => openOrderDetail(order)}
                          >
                            <td
                              className="px-4 py-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => toggleOrderSelect(order.id)}
                                className="text-gray-400 hover:text-brand-500"
                              >
                                {selectedOrderIds.has(order.id) ? (
                                  <CheckSquare className="w-4 h-4 text-brand-500" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-1.5 h-8 rounded-full flex-shrink-0 ${
                                    STATUS_DOT[order.status] || "bg-gray-300"
                                  }`}
                                />
                                <div>
                                  <p className="font-semibold text-gray-900 text-sm">
                                    {order.orderNumber}
                                  </p>
                                  <p className="text-xs text-gray-400 sm:hidden">
                                    {order.customerName}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 hidden sm:table-cell">
                              <p className="font-medium text-gray-900 text-sm">
                                {order.customerName}
                              </p>
                              <p className="text-xs text-gray-400">
                                {order.phone}
                              </p>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-ZA",
                                { day: "numeric", month: "short", year: "numeric" }
                              )}
                            </td>
                            <td className="px-4 py-3 font-bold text-gray-900 text-sm">
                              {formatPrice(order.total)}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={
                                  STATUS_BADGE_VARIANT[order.status] ||
                                  "default"
                                }
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td
                              className="px-4 py-3 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={`https://wa.me/${order.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp customer"
                                className="inline-flex p-2 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors text-gray-400"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Product Form Modal ─────────────────────────────────── */}
      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => fetchData()}
        />
      )}

      {/* ── Order Slide-over ──────────────────────────────────── */}
      <OrderSlideOver
        order={selectedOrder}
        open={slideOverOpen}
        onClose={() => setSlideOverOpen(false)}
        onUpdateStatus={handleUpdateOrderStatus}
        updatingOrderId={updatingOrderId}
        selectedStatus={slideOverStatus}
        onStatusChange={setSlideOverStatus}
      />
    </div>
  );
}