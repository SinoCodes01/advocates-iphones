import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27735152402";

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
  items: { name: string; quantity: number; price: number; storage?: string; color?: string; condition?: string }[],
  total: number,
  deliveryFee: number,
  customerName: string,
  deliveryAddress: string,
  paymentMethod: string,
  colourPreference?: string
): string {
  const itemsList = items
    .map((item) => {
      const details = [item.storage, item.color, item.condition].filter(Boolean).join(", ");
      return `• ${item.name}${details ? ` (${details})` : ""} x${item.quantity} - ${formatPrice(item.price * item.quantity)}`;
    })
    .join("\n");

  const paymentMethodLabel = {
    whatsapp: "WhatsApp / EFT",
    eft: "Direct EFT",
    cod: "Cash on Delivery",
  }[paymentMethod] || paymentMethod;

  const colourLine = colourPreference?.trim()
    ? `\n*Colour Preference:* ${colourPreference.trim()}`
    : "";

  return `*ORDER CONFIRMATION - ${orderNumber}*

Hi Advocates iPhones! I've just placed an order on your website.

*Customer Details:*
• Name: ${customerName}
• Delivery: ${deliveryAddress || "Store Collection"}${colourLine}

*Order Summary:*
${itemsList}

*Subtotal:* ${formatPrice(total - deliveryFee)}
*Delivery:* ${formatPrice(deliveryFee)}
*Total Amount:* ${formatPrice(total)}

*Payment Method:* ${paymentMethodLabel}

Please confirm stock and send through the payment details so I can finalize my order. 

Thank you!`;
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