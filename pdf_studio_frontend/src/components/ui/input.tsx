import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full border-3 border-black bg-white px-4 py-3 font-mono text-sm outline-none transition-all duration-100",
          "placeholder:text-muted-foreground",
          "focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-neo-lg",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        style={{ boxShadow: "3px 3px 0px 0px #000000" }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
