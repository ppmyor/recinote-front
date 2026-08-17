import * as React from "react";

import { cn } from "@/lib/utils";

type AlertVariant = "success" | "error";

export interface AlertProps {
  variant?: AlertVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<AlertVariant, string> = {
  success: "border-brand-blue-500 text-navy-100",
  error: "border-error-500 text-error-400",
};

export function Alert({ variant = "error", className, children }: AlertProps) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border bg-navy-700 px-4 py-3 text-sm",
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </p>
  );
}
