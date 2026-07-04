"use client";

import { useEffect, useRef } from "react";
import { Order } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import {
  X,
  MessageCircle,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  Package,
  Loader2,
} from "lucide-react";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-50 border-amber-200 text-amber-800",
  confirmed: "bg-blue-50 border-blue-200 text-blue-800",
  packed: "bg-purple-50 border-purple-200 text-purple-800",
  shipped: "bg-indigo-50 border-indigo-200 text-indigo-800",
  delivered: "bg-green-50 border-green-200 text-green-800",
  cancelled: "bg-red-50 border-red-200 text-red-800",
};

const BADGE_VARIANT: Record<string, any> = {
  pending: "warning",
  confirmed: "info",
  packed: "default",
  shipped: "default",
  delivered: "success",
  cancelled: "default",
};

interface OrderSlideOverProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  updatingOrderId: string | null;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
}

export function OrderSlideOver({
  order,
  open,
  onClose,
  onUpdateStatus,
  updatingOrderId,
  selectedStatus,
  onStatusChange,
}: OrderSlideOverProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-navy-950/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-0 h-full z-50 w-full max-w-xl bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {order ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-navy-900 text-white flex-shrink-0">
              <div>
                <p className="text-xs text-navy-300 uppercase tracking-widest font-semibold mb-1">
                  Order Detail
                </p>
                <h2 className="text-xl font-bold">{order.orderNumber}</h2>
                <p className="text-navy-300 text-sm">
                  {new Date(order.createdAt).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto">
              {/* Status pill */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-600">
                  Status:
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                    STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Customer Details */}
              <div className="px-6 py-5 border-b border-gray-50 space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Customer
                </h3>
                <div className="flex items-center gap-3 text-gray-700">
                  <User className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span className="font-semibold">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <a
                    href={`tel:${order.phone}`}
                    className="hover:text-brand-600 transition-colors"
                  >
                    {order.phone}
                  </a>
                </div>
                {order.email && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-brand-500 flex-shrink-0" />
                    <a
                      href={`mailto:${order.email}`}
                      className="hover:text-brand-600 transition-colors"
                    >
                      {order.email}
                    </a>
                  </div>
                )}
                <div className="flex items-start gap-3 text-gray-700">
                  <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm whitespace-pre-line">
                    {order.deliveryAddress}
                  </span>
                </div>
              </div>

              {/* Payment method */}
              <div className="px-6 py-5 border-b border-gray-50 space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Payment
                </h3>
                <div className="flex items-center gap-3 text-gray-700">
                  <CreditCard className="w-4 h-4 text-brand-500 flex-shrink-0" />
                  <span className="capitalize font-medium">
                    {order.paymentMethod === "whatsapp"
                      ? "WhatsApp Confirmation"
                      : order.paymentMethod === "eft"
                      ? "EFT / Bank Transfer"
                      : "Cash on Delivery"}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-5 border-b border-gray-50 space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Items
                </h3>
                <div className="space-y-3">
                  {order.items?.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-brand-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900 text-sm">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="px-6 py-5 border-b border-gray-50 space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Summary
                </h3>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 text-base">
                  <span>Total</span>
                  <span className="text-brand-600">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Notes */}
              {order.notes && (
                <div className="px-6 py-5 border-b border-gray-50 space-y-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Notes
                  </h3>
                  <p className="text-sm text-gray-600 bg-amber-50 rounded-xl p-3 border border-amber-100">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex-shrink-0 space-y-4">
              <div className="flex items-center gap-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-brand-500 outline-none bg-white font-medium capitalize"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} className="capitalize">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={() => onUpdateStatus(order.id, selectedStatus)}
                  loading={updatingOrderId === order.id}
                  className="min-w-[120px]"
                >
                  Update Status
                </Button>
              </div>

              <a
                href={`https://wa.me/${order.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full"
              >
                <Button variant="outline" className="w-full gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Customer
                </Button>
              </a>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        )}
      </div>
    </>
  );
}
