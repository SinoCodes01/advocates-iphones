import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-xl",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Variants
          variant === "primary" &&
            "bg-gradient-to-r from-navy-700 to-brand-500 hover:from-navy-800 hover:to-brand-600 text-white shadow-lg hover:shadow-xl",
          variant === "secondary" &&
            "bg-navy-700 hover:bg-navy-800 text-white",
          variant === "outline" &&
            "border-2 border-navy-700 text-navy-700 hover:bg-navy-50",
          variant === "ghost" &&
            "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          // Sizes
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-base",
          size === "lg" && "px-8 py-4 text-lg"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };