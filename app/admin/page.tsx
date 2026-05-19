"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { mockProducts, mockOrders } from "@/lib/mock-data";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Package,
  Users,
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
  Settings,
} from "lucide-react";

type Tab = "dashboard" | "products" | "orders";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Calculate dashboard stats
  const totalProducts = mockProducts.length;
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter((o) => o.status === "pending").length;
  const revenue = mockOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <div className="bg-navy-900 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400">Manage your store</p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Eye className="w-5 h-5" />
                View Store
              </Link>
              <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
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
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
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
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
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

        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats */}
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
                <div className="space-y-4">
                  {mockOrders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.customerName} • {formatPrice(order.total)}
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
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">{totalProducts} products</p>
              <Button>
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left px-6 py-4 font-medium text-gray-600">
                          Product
                        </th>
                        <th className="text-left px-6 py-4 font-medium text-gray-600">
                          Price
                        </th>
                        <th className="text-left px-6 py-4 font-medium text-gray-600">
                          Stock
                        </th>
                        <th className="text-left px-6 py-4 font-medium text-gray-600">
                          Condition
                        </th>
                        <th className="text-left px-6 py-4 font-medium text-gray-600">
                          Status
                        </th>
                        <th className="text-right px-6 py-4 font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                {product.images[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-lg font-bold text-gray-300">
                                      {product.name.charAt(0)}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {product.storage}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {formatPrice(product.price)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={
                                product.stock === 0
                                  ? "text-red-500"
                                  : product.stock <= 3
                                  ? "text-orange-500"
                                  : "text-green-500"
                              }
                            >
                              {product.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="capitalize">{product.condition}</span>
                          </td>
                          <td className="px-6 py-4">
                            {product.active ? (
                              <Badge variant="success">Active</Badge>
                            ) : (
                              <Badge variant="error">Inactive</Badge>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Edit className="w-4 h-4 text-gray-600" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4 text-red-500" />
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
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">{totalOrders} orders</p>
              <div className="flex gap-4">
                <select className="px-4 py-2 border border-gray-200 rounded-xl bg-white">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {mockOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order.id ? null : order.id
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="font-bold text-gray-900">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-500">{order.phone}</p>
                          </div>
                          <div>
                            <p className="font-bold text-navy-900">
                              {formatPrice(order.total)}
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
                        {expandedOrder === order.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {expandedOrder === order.id && (
                      <div className="mt-6 pt-6 border-t space-y-4">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Delivery Address
                            </h4>
                            <p className="text-gray-600 whitespace-pre-line">
                              {order.deliveryAddress}
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">
                              Order Items
                            </h4>
                            <ul className="space-y-2">
                              {order.items.map((item, index) => (
                                <li
                                  key={index}
                                  className="flex justify-between text-sm"
                                >
                                  <span>
                                    {item.productName} x{item.quantity}
                                  </span>
                                  <span>{formatPrice(item.unitPrice)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4 border-t">
                          <select className="px-4 py-2 border border-gray-200 rounded-xl bg-white">
                            <option value="pending" selected={order.status === "pending"}>
                              Pending
                            </option>
                            <option value="confirmed" selected={order.status === "confirmed"}>
                              Confirmed
                            </option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <a
                            href={`https://wa.me/${order.phone}?text=Hi ${order.customerName}, regarding your order ${order.orderNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button variant="outline">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              WhatsApp Customer
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}