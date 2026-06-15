import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-neo-yellow text-black",
        secondary: "bg-neo-blue text-white",
        destructive: "bg-neo-pink text-white",
        outline: "bg-white text-black",
        success: "bg-neo-green text-black",
        muted: "bg-gray-200 text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  return <Loader2 className={cn("animate-spin", className)} size={size} />;
}

export { Badge, badgeVariants, LoadingSpinner };
