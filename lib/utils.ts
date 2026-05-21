import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ADV-${timestamp}-${random}`;
}

export function getWhatsAppLink(
  phone: string,
  message: string
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function buildWhatsAppMessage(
  orderNumber: string,
  items: { name: string; quantity: number; price: number }[],
  total: number,
  customerName: string
): string {
  const itemsList = items
    .map((item) => `• ${item.name} x${item.quantity} - R${item.price}`)
    .join("\n");

  return `Hi Advocates iPhones! I've just placed order ${orderNumber}.

*My Order Details:*
${itemsList}

*Total: R${total}*

Customer Name: ${customerName}

Please confirm availability and payment details. Thank you!`;
}

export function conditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    new: "Brand New",
    refurbished: "Refurbished",
    "pre-owned": "Pre-Owned",
  };
  return labels[condition] || condition;
}

export function calculateDiscountPercentage(price: number, compareAtPrice: number): number {
  if (compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function stockStatus(stock: number): {
  label: string;
  color: string;
} {
  if (stock === 0) return { label: "Out of Stock", color: "text-red-500" };
  if (stock <= 3) return { label: `Only ${stock} left`, color: "text-orange-500" };
  return { label: "In Stock", color: "text-green-500" };
}