import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...rest }, ref) => {
    return (
      <label
        htmlFor={id}
        className="inline-flex select-none items-center gap-2 text-sm text-navy-300"
      >
        <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className={cn(
              "peer h-4 w-4 shrink-0 appearance-none rounded border border-navy-600 bg-navy-700",
              "checked:border-brand-blue-500 checked:bg-brand-blue-500",
              "focus:outline-none focus:ring-2 focus:ring-brand-blue-400",
              className,
            )}
            {...rest}
          />
          <Check className="pointer-events-none absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100" />
        </span>
        {label}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
