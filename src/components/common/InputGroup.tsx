import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputGroupProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}

export function InputGroup({
  label,
  htmlFor,
  error,
  helperText,
  className,
  children,
}: InputGroupProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-navy-100">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p role="alert" className="text-xs text-error-400">
          {error}
        </p>
      ) : (
        helperText && <p className="text-xs text-navy-300">{helperText}</p>
      )}
    </div>
  );
}
