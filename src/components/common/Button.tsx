import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "outline";
type ButtonSize = "md" | "sm";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-brand-blue-500 text-white hover:bg-brand-blue-600",
  outline: "bg-transparent text-navy-100 border border-navy-600 hover:bg-navy-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "h-12 px-5 text-sm rounded-lg",
  sm: "h-9 px-3 text-xs rounded-md",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:ring-offset-0",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className,
        )}
        {...rest}
      >
        {loading && (
          <span
            aria-hidden="true"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
