"use client";

import { useMemo, useState } from "react";
import { Order, Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, ShoppingBag, Package, DollarSign, Calendar } from "lucide-react";

type DateRange = "7d" | "30d" | "90d" | "all" | "custom";

interface AdminChartsProps {
  orders: Order[];
  products: Product[];
}

const RANGE_LABELS: Record<DateRange, string> = {
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
  "90d": "Last 90 Days",
  all: "All Time",
  custom: "Custom",
};

function getStartDate(range: DateRange, customStart?: string): Date {
  const now = new Date();
  switch (range) {
    case "7d":
      return new Date(now.setDate(now.getDate() - 7));
    case "30d":
      return new Date(now.setDate(now.getDate() - 30));
    case "90d":
      return new Date(now.setDate(now.getDate() - 90));
    case "custom":
      return customStart ? new Date(customStart) : new Date(0);
    default:
      return new Date(0);
  }
}

function formatDateLabel(dateStr: string, range: DateRange): string {
  const date = new Date(dateStr);
  if (range === "7d" || range === "30d") {
    return date.toLocaleDateString("en-ZA", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-ZA", { month: "short", year: "2-digit" });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-navy-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} style={{ color: entry.color }}>
            {entry.name}:{" "}
            <span className="font-bold">
              {entry.name.toLowerCase().includes("revenue")
                ? formatPrice(entry.value)
                : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AdminCharts({ orders, products }: AdminChartsProps) {
  const [range, setRange] = useState<DateRange>("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const filteredOrders = useMemo(() => {
    const start = getStartDate(range, customStart);
    const end =
      range === "custom" && customEnd ? new Date(customEnd) : new Date();
    end.setHours(23, 59, 59, 999);
    return orders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= end;
    });
  }, [orders, range, customStart, customEnd]);

  // Revenue over time (grouped by day for <=30d, by month for 90d/all)
  const revenueData = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      let key: string;
      if (range === "7d" || range === "30d" || (range === "custom")) {
        key = d.toISOString().split("T")[0]; // YYYY-MM-DD
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
      grouped[key] = (grouped[key] || 0) + Number(o.total);
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({
        date: formatDateLabel(date + (date.length === 7 ? "-01" : ""), range),
        Revenue: revenue,
      }));
  }, [filteredOrders, range]);

  // Orders per day
  const ordersPerDay = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      let key: string;
      if (range === "7d" || range === "30d" || range === "custom") {
        key = d.toISOString().split("T")[0];
      } else {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
      grouped[key] = (grouped[key] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, Orders]) => ({
        date: formatDateLabel(date + (date.length === 7 ? "-01" : ""), range),
        Orders,
      }));
  }, [filteredOrders, range]);

  // Top products by revenue
  const topProducts = useMemo(() => {
    const productRevenue: Record<string, { name: string; revenue: number; units: number }> = {};
    filteredOrders.forEach((o) => {
      o.items?.forEach((item: any) => {
        if (!productRevenue[item.productName]) {
          productRevenue[item.productName] = { name: item.productName, revenue: 0, units: 0 };
        }
        productRevenue[item.productName].revenue += item.unitPrice * item.quantity;
        productRevenue[item.productName].units += item.quantity;
      });
    });
    return Object.values(productRevenue)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)
      .map((p) => ({
        name:
          p.name.length > 20 ? p.name.slice(0, 20) + "…" : p.name,
        Revenue: p.revenue,
        Units: p.units,
      }));
  }, [filteredOrders]);

  // KPIs
  const totalRevenue = filteredOrders.reduce((s, o) => s + Number(o.total), 0);
  const avgOrderValue =
    filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0;
  const pendingCount = filteredOrders.filter((o) => o.status === "pending").length;
  const deliveredCount = filteredOrders.filter((o) => o.status === "delivered").length;

  return (
    <div className="space-y-6">
      {/* Date Range Picker */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold text-gray-500 mr-1 flex items-center gap-1">
          <Calendar className="w-4 h-4" /> Period:
        </span>
        {(["7d", "30d", "90d", "all", "custom"] as DateRange[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              range === r
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                : "bg-white text-gray-600 border border-gray-200 hover:border-brand-300"
            }`}
          >
            {RANGE_LABELS[r]}
          </button>
        ))}
        {range === "custom" && (
          <div className="flex items-center gap-2 ml-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-500 outline-none"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* Mini KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Revenue",
            value: formatPrice(totalRevenue),
            icon: <TrendingUp className="w-4 h-4" />,
            color: "text-green-600 bg-green-50",
          },
          {
            label: "Avg Order Value",
            value: formatPrice(avgOrderValue),
            icon: <DollarSign className="w-4 h-4" />,
            color: "text-brand-600 bg-brand-50",
          },
          {
            label: "Orders",
            value: filteredOrders.length.toString(),
            icon: <ShoppingBag className="w-4 h-4" />,
            color: "text-purple-600 bg-purple-50",
          },
          {
            label: "Delivered",
            value: deliveredCount.toString(),
            icon: <Package className="w-4 h-4" />,
            color: "text-indigo-600 bg-indigo-50",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-3"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${kpi.color}`}>
              {kpi.icon}
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">{kpi.label}</p>
              <p className="font-bold text-gray-900 text-sm">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue over time */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">
            Revenue Over Time
          </h3>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#007FFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#007FFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `R${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="Revenue"
                  stroke="#007FFF"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data for this period
            </div>
          )}
        </div>

        {/* Orders per day */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">
            Orders Per Day
          </h3>
          {ordersPerDay.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ordersPerDay} margin={{ top: 4, right: 4, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="Orders"
                  fill="#007FFF"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data for this period
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm md:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">
            Top Products by Revenue
          </h3>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                layout="vertical"
                data={topProducts}
                margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={130}
                  tick={{ fontSize: 11, fill: "#374151" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="Revenue"
                  fill="#001A33"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
              No data for this period
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
