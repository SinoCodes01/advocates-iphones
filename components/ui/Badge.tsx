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

export function ConditionBadge({ condition, className }: { condition: string; className?: string }) {
  const styles =
    condition === "new"
      ? "bg-brand-500 text-white"
      : condition === "refurbished"
      ? "bg-navy-900 text-white"
      : "bg-gray-100 text-gray-800";

  const label =
    condition === "new"
      ? "Brand New"
      : condition === "refurbished"
      ? "Refurbished"
      : "Pre-Owned";

  return (
    <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm", styles, className)}>
      {label}
    </span>
  );
}

export function AvailabilityBadge({ availability }: { availability: "available" | "reserved" | "sold" }) {
  if (availability === "sold") return <Badge variant="error">Sold</Badge>;
  if (availability === "reserved") return <Badge variant="warning">Reserved</Badge>;
  return <Badge variant="success">Available</Badge>;
}