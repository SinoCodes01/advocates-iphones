"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Product, Order } from "@/lib/types";
import { ProductForm } from "@/components/admin/ProductForm";
import {
  Package,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  LogOut,
  BarChart3,
  Loader2,
} from "lucide-react";

type Tab = "dashboard" | "products" | "orders";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Form/Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      if (!supabase) return;
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        setUser(session.user);
        fetchData();
      }
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  };

  const fetchData = async () => {
    // ... rest of fetchData ...
    setIsLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();

      if (productsData.success) setProducts(productsData.products);
      if (ordersData.success) setOrders(ordersData.orders);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to delete product");
      }
    } catch (error) {
      alert("An error occurred while deleting the product");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/products`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          active: !product.active,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert(data.error || "Failed to update product status");
      }
    } catch (error) {
      alert("An error occurred while updating the product status");
    }
  };

  // Calculate dashboard stats
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const revenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  if (isLoading && activeTab === "dashboard") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-navy-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400">Logged in as: {user?.email}</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Eye className="w-5 h-5" />
                View Store
              </Link>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-navy-700 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === "products"
                ? "bg-navy-700 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Package className="w-5 h-5" />
            Products
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap ${
              activeTab === "orders"
                ? "bg-navy-700 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            Orders
            {pendingOrders > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingOrders}
              </span>
            )}
          </button>
        </div>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-3xl font-bold text-navy-900">
                        {formatPrice(revenue)}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-3xl font-bold text-navy-900">
                        {totalOrders}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
                      <ShoppingBag className="w-6 h-6 text-brand-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Pending Orders</p>
                      <p className="text-3xl font-bold text-orange-500">
                        {pendingOrders}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Products</p>
                      <p className="text-3xl font-bold text-navy-900">
                        {totalProducts}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent orders */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Recent Orders</h2>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-brand-500 hover:text-brand-600 font-medium text-sm"
                >
                  View all
                </button>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.orderNumber || order.order_number}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.customerName || order.customer_name} • {formatPrice(order.total)}
                          </p>
                        </div>
                        <Badge
                          variant={
                            order.status === "pending"
                              ? "warning"
                              : order.status === "confirmed"
                              ? "info"
                              : "success"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">No orders yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">{totalProducts} products</p>
              <Button onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}>
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Button>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left px-6 py-4 font-medium text-gray-600">Product</th>
                          <th className="text-left px-6 py-4 font-medium text-gray-600">Price</th>
                          <th className="text-left px-6 py-4 font-medium text-gray-600">Stock</th>
                          <th className="text-left px-6 py-4 font-medium text-gray-600">Status</th>
                          <th className="text-right px-6 py-4 font-medium text-gray-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                  {product.images?.[0] ? (
                                    <Image src={product.images[0]} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                                      {product.name.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{product.name}</p>
                                  <p className="text-xs text-gray-500">{product.storage} • {product.color}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">{formatPrice(product.price)}</td>
                            <td className="px-6 py-4">
                              <span className={product.stock === 0 ? "text-red-500" : "text-gray-700"}>{product.stock}</span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleToggleActive(product)}
                                className="focus:outline-none"
                                title={product.active ? "Click to deactivate" : "Click to activate"}
                              >
                                <Badge variant={product.active ? "success" : "secondary"}>
                                  {product.active ? "Active" : "Inactive"}
                                </Badge>
                              </button>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => {
                                    setEditingProduct(product);
                                    setIsFormOpen(true);
                                  }}
                                  className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-2 hover:bg-gray-100 rounded-lg text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">{totalOrders} orders</p>
            </div>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="p-6">
                      <div className="cursor-pointer" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div>
                              <p className="font-bold text-gray-900">{order.order_number || order.orderNumber}</p>
                              <p className="text-xs text-gray-500">{new Date(order.created_at || order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <p className="font-medium">{order.customer_name || order.customerName}</p>
                              <p className="text-xs text-gray-500">{order.phone}</p>
                            </div>
                            <p className="font-bold text-navy-900">{formatPrice(order.total)}</p>
                            <Badge variant={order.status === "pending" ? "warning" : "success"}>{order.status}</Badge>
                          </div>
                          {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </div>
                      
                      {expandedOrder === order.id && (
                        <div className="mt-6 pt-6 border-t space-y-4">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-sm font-bold text-gray-700 mb-2">Delivery Address</h4>
                              <p className="text-sm text-gray-600 whitespace-pre-line">{order.deliveryAddress}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-700 mb-2">Order Items</h4>
                              <ul className="space-y-1">
                                {order.items?.map((item: any, i: number) => (
                                  <li key={i} className="flex justify-between text-sm">
                                    <span>{item.productName} x{item.quantity}</span>
                                    <span>{formatPrice(item.unitPrice)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex gap-4 pt-4 border-t">
                            <a href={`https://wa.me/${order.phone}`} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm"><MessageCircle className="w-4 h-4 mr-2" /> WhatsApp Customer</Button>
                            </a>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <ProductForm 
          product={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => fetchData()}
        />
      )}
    </div>
  );
}