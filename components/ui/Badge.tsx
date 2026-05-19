import { cn } from "@/lib/utils";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "error" | "info";
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variant === "default" && "bg-gray-100 text-gray-800",
        variant === "success" && "bg-green-100 text-green-800",
        variant === "warning" && "bg-orange-100 text-orange-800",
        variant === "error" && "bg-red-100 text-red-800",
        variant === "info" && "bg-blue-100 text-blue-800",
        className
      )}
    >
      {children}
    </span>
  );
}

export function ConditionBadge({ condition }: { condition: string }) {
  const variant =
    condition === "new"
      ? "success"
      : condition === "refurbished"
      ? "info"
      : "warning";

  const label =
    condition === "new"
      ? "Brand New"
      : condition === "refurbished"
      ? "Refurbished"
      : "Pre-Owned";

  return <Badge variant={variant}>{label}</Badge>;
}

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <Badge variant="error">Out of Stock</Badge>;
  if (stock <= 3) return <Badge variant="warning">Only {stock} left</Badge>;
  return <Badge variant="success">In Stock</Badge>;
}