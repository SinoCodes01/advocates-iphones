"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { ChevronLeft, MessageCircle, Trash2 } from "lucide-react";
import { mockOrders } from "@/lib/mock-data";

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { items, getSubtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<"info" | "review" | "confirmation">("info");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    deliveryAddress: "",
    paymentMethod: "whatsapp" as "whatsapp" | "eft" | "cod",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = getSubtotal();
  const deliveryFee = 0; // Free delivery for MVP

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-700"></div>
      </div>
    );
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("review");
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          items,
          subtotal,
          total: subtotal + deliveryFee,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setOrderNumber(data.order.order_number);
        // Clear cart and show confirmation
        clearCart();
        setStep("confirmation");
      } else {
        alert(data.error || "Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = orderNumber 
    ? `Hi Advocates iPhones! I've just placed order ${orderNumber}.\n\n*My Order Details:*\n${items.map(i => `• ${i.product.name} x${i.quantity}`).join("\n")}\n\n*Total: ${formatPrice(subtotal + deliveryFee)}*\n\nCustomer Name: ${formData.customerName}\n\nPlease confirm availability and payment details. Thank you!`
    : "";

  const whatsappLink = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "27735617081"}?text=${encodeURIComponent(whatsappMessage)}`;

  if (items.length === 0 && step !== "confirmation") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <Link
            href="/shop"
            className="text-brand-500 hover:text-brand-600 font-medium"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-navy-900">Checkout</h1>
              <p className="text-gray-600">
                {step === "info" && "Step 1 of 2: Your information"}
                {step === "review" && "Step 2 of 2: Review your order"}
                {step === "confirmation" && "Order confirmed!"}
              </p>
            </div>
            {step !== "confirmation" && (
              <Link
                href="/cart"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to cart
              </Link>
            )}
          </div>

          {/* Progress */}
          {step !== "confirmation" && (
            <div className="flex items-center gap-4 mt-6">
              <div
                className={`flex items-center gap-2 ${
                  step === "info" ? "text-brand-500" : "text-green-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === "info"
                      ? "bg-brand-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {step === "review" ? "✓" : "1"}
                </div>
                <span className="font-medium">Information</span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 rounded">
                <div
                  className={`h-full bg-green-500 rounded transition-all ${
                    step === "review" ? "w-full" : "w-0"
                  }`}
                />
              </div>
              <div
                className={`flex items-center gap-2 ${
                  step === "review" ? "text-brand-500" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === "review"
                      ? "bg-brand-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="font-medium">Review</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {step === "info" && (
              <form onSubmit={handleSubmitInfo}>
                <Card>
                  <CardHeader>
                    <h2 className="font-bold text-lg">Your Information</h2>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="customerName"
                          required
                          value={formData.customerName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                          placeholder="Sipho M."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                          placeholder="082 123 4567"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email (optional)
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="sipho@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <textarea
                        name="deliveryAddress"
                        required
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                        placeholder="123 Main Street, KuGompo City, 8001"                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Method *
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 border border-brand-500 bg-brand-50/50 rounded-xl cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="whatsapp"
                            checked={formData.paymentMethod === "whatsapp"}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-brand-500"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-navy-900">WhatsApp Payment</p>
                            <p className="text-sm text-gray-600">
                              Confirm order via WhatsApp and pay via EFT/Cash
                            </p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Notes (optional)
                      </label>
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                        placeholder="Any special instructions..."
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6">
                  <Button type="submit" size="lg" className="w-full">
                    Continue to Review
                  </Button>
                </div>
              </form>
            )}

            {step === "review" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h2 className="font-bold text-lg">Review Your Order</h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">
                        Contact Information
                      </h3>
                      <p className="text-gray-900">{formData.customerName}</p>
                      <p className="text-gray-600">{formData.phone}</p>
                      {formData.email && (
                        <p className="text-gray-600">{formData.email}</p>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-medium text-gray-700 mb-2">
                        Delivery Address
                      </h3>
                      <p className="text-gray-900 whitespace-pre-line">
                        {formData.deliveryAddress}
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="font-medium text-gray-700 mb-2">
                        Payment Method
                      </h3>
                      <p className="text-gray-900 capitalize">
                        {formData.paymentMethod === "whatsapp"
                          ? "WhatsApp Payment (EFT)"
                          : formData.paymentMethod}
                      </p>
                    </div>

                    {formData.notes && (
                      <div className="border-t pt-4">
                        <h3 className="font-medium text-gray-700 mb-2">
                          Order Notes
                        </h3>
                        <p className="text-gray-600">{formData.notes}</p>
                      </div>
                    )}

                    <button
                      onClick={() => setStep("info")}
                      className="text-brand-500 hover:text-brand-600 font-medium text-sm"
                    >
                      Edit information
                    </button>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setStep("info")}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={handlePlaceOrder}
                    loading={isSubmitting}
                    className="flex-1"
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            )}

            {step === "confirmation" && (
              <Card className="text-center">
                <CardContent className="py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg
                      className="w-10 h-10 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Order Placed Successfully!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Your order number is:{" "}
                    <span className="font-bold text-navy-700">{orderNumber}</span>
                  </p>
                  <p className="text-gray-600 mb-8">
                    We will contact you shortly to confirm availability and
                    payment details.
                  </p>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="lg" className="bg-green-500 hover:bg-green-600">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Confirm via WhatsApp
                    </Button>
                  </a>

                  <div className="mt-6">
                    <Link
                      href="/shop"
                      className="text-brand-500 hover:text-brand-600 font-medium"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order summary */}
          {step !== "confirmation" && (
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <h2 className="font-bold text-lg">Order Summary</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.selectedVariant}`} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xl font-bold text-gray-300">
                              {item.product.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.product.name}
                        </p>
                        {item.selectedVariant && (
                          <p className="text-sm text-gray-500">
                            {item.selectedVariant}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}