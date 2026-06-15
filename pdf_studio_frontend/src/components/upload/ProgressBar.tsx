import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, showLabel = true, className }: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Progress</span>
          <span className="font-mono text-xs font-bold">{percentage}%</span>
        </div>
      )}
      <div className="h-4 w-full border-3 border-black bg-white overflow-hidden">
        <div
          className="h-full bg-neo-yellow transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
