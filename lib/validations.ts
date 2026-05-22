import { z } from "zod";

export const orderSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  deliveryAddress: z.string().min(5, "Address must be at least 5 characters"),
  paymentMethod: z.enum(["whatsapp", "eft", "cod"]),
  notes: z.string().optional(),
  items: z.array(z.object({
    product: z.object({
      id: z.string().uuid(),
      name: z.string(),
      price: z.number(),
      storage: z.string().optional(),
    }),
    quantity: z.number().int().positive(),
    selectedVariant: z.string().optional(),
  })).min(1, "At least one item is required"),
  subtotal: z.number().min(0),
  deliveryFee: z.number().min(0),
  total: z.number().min(0),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  compare_at_price: z.number().optional(),
  stock_quantity: z.number().int().min(0, "Stock must be non-negative").default(0),
  condition: z.enum(["new", "refurbished", "pre-owned"]),
  storage: z.string().optional(),
  color: z.string().optional(),
  color_hex: z.string().optional(),
  category: z.string().optional(),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  images: z.array(z.string()).min(1, "At least one image is required"),
  warranty_months: z.number().int().min(0).default(12),
  battery_health: z.number().int().min(0).max(100).optional(),
});
