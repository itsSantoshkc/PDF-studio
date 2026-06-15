import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw, Palette, Wand2 } from "lucide-react";
import type { FilterOptions } from "@/types/editor";

interface FilterPanelProps {
  onApplyFilters: (filters: FilterOptions) => void;
  isProcessing?: boolean;
}

const defaultFilters: FilterOptions = {
  brightness: 100,
  contrast: 100,
  sharpness: 100,
  denoise: false,
  binarize: false,
  deskew: false,
};

export function FilterPanel({ onApplyFilters, isProcessing }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleSliderChange = (key: keyof FilterOptions, value: number[]) => {
    setFilters((prev) => ({ ...prev, [key]: value[0] }));
  };

  const handleToggleChange = (key: keyof FilterOptions) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 border-b-3 border-black">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-wider">Filters</span>
        </div>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Brightness</Label>
            <span className="font-mono text-xs font-bold">{filters.brightness}%</span>
          </div>
          <Slider
            value={[filters.brightness]}
            onValueChange={(v) => handleSliderChange("brightness", v)}
            min={0}
            max={200}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Contrast</Label>
            <span className="font-mono text-xs font-bold">{filters.contrast}%</span>
          </div>
          <Slider
            value={[filters.contrast]}
            onValueChange={(v) => handleSliderChange("contrast", v)}
            min={0}
            max={200}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Sharpness</Label>
            <span className="font-mono text-xs font-bold">{filters.sharpness}%</span>
          </div>
          <Slider
            value={[filters.sharpness]}
            onValueChange={(v) => handleSliderChange("sharpness", v)}
            min={0}
            max={200}
            step={1}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <Label className="text-xs">Auto Enhance</Label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {[
              { key: "denoise" as const, label: "Denoise", color: "bg-neo-green" },
              { key: "binarize" as const, label: "Binarize", color: "bg-neo-blue" },
              { key: "deskew" as const, label: "Deskew", color: "bg-neo-purple" },
            ].map((item) => (
              <button
                key={item.key}
                className={cn(
                  "flex items-center justify-between p-2 border-3 border-black transition-all",
                  filters[item.key] ? item.color : "bg-white",
                  "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo"
                )}
                onClick={() => handleToggleChange(item.key)}
              >
                <span className="font-mono text-xs uppercase tracking-wider">{item.label}</span>
                <div className={cn(
                  "w-8 h-4 border-2 border-black relative transition-colors",
                  filters[item.key] ? "bg-black" : "bg-white"
                )}>
                  <div className={cn(
                    "absolute top-0 w-3 h-3 border border-black transition-all",
                    filters[item.key] ? "right-0 bg-white" : "left-0 bg-black"
                  )} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={() => onApplyFilters(filters)}
        disabled={isProcessing}
        className="w-full mt-6"
      >
        {isProcessing ? (
          <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent animate-spin mr-2" />
        ) : null}
        {isProcessing ? "Processing..." : "Apply Filters"}
      </Button>
    </div>
  );
}
