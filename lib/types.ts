export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  condition: "new" | "pre-owned";
  storage?: string;
  color?: string;
  colorHex?: string;
  images: string[];
  warrantyMonths: number;
  batteryHealth?: number;
  category?: string;
  active: boolean;
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string;
  deliveryAddress: string;
  paymentMethod: "whatsapp" | "eft" | "cod";
  status: "pending" | "confirmed" | "packed" | "shipped" | "delivered" | "cancelled";
  subtotal: number;
  deliveryFee: number;
  total: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CheckoutFormData {
  customerName: string;
  phone: string;
  email: string;
  deliveryAddress: string;
  paymentMethod: "whatsapp" | "eft" | "cod";
  notes: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}