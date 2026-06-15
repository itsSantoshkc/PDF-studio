import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-100 border-3 border-black disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-white text-black hover:-translate-x-0.5 hover:-translate-y-0.5",
        primary: "bg-neo-yellow text-black hover:-translate-x-0.5 hover:-translate-y-0.5",
        destructive: "bg-neo-pink text-white hover:-translate-x-0.5 hover:-translate-y-0.5",
        outline: "bg-transparent text-black hover:bg-black hover:text-white",
        secondary: "bg-neo-blue text-white hover:-translate-x-0.5 hover:-translate-y-0.5",
        ghost: "bg-transparent text-black hover:bg-neo-yellow border-transparent",
        link: "text-black underline-offset-4 hover:underline border-transparent bg-transparent",
        success: "bg-neo-green text-black hover:-translate-x-0.5 hover:-translate-y-0.5",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-9 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        xl: "h-16 px-10 py-5 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          "shadow-neo hover:shadow-neo-lg active:shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
