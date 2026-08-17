"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<{ className?: string }>;
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon: Icon, error = false, type, ...rest }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full">
        {Icon && (
          <Icon
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400"
          />
        )}
        <input
          ref={ref}
          type={resolvedType}
          className={cn(
            "h-12 w-full rounded-lg border bg-navy-700 px-4 text-sm text-navy-100",
            "placeholder:text-navy-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-blue-400 focus:border-transparent",
            error ? "border-error-500 focus:ring-error-500" : "border-navy-600",
            Icon && "pl-10",
            isPassword && "pr-10",
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="비밀번호 표시 전환"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-100"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
