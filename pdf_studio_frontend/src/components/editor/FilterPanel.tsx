import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
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
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filters</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Brightness</Label>
            <span className="text-sm text-muted-foreground">{filters.brightness}%</span>
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
            <Label className="text-sm">Contrast</Label>
            <span className="text-sm text-muted-foreground">{filters.contrast}%</span>
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
            <Label className="text-sm">Sharpness</Label>
            <span className="text-sm text-muted-foreground">{filters.sharpness}%</span>
          </div>
          <Slider
            value={[filters.sharpness]}
            onValueChange={(v) => handleSliderChange("sharpness", v)}
            min={0}
            max={200}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Auto Enhance</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.denoise ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggleChange("denoise")}
            >
              Denoise
            </Button>
            <Button
              variant={filters.binarize ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggleChange("binarize")}
            >
              Binarize
            </Button>
            <Button
              variant={filters.deskew ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggleChange("deskew")}
            >
              Deskew
            </Button>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onApplyFilters(filters)}
        disabled={isProcessing}
        className="w-full"
      >
        {isProcessing ? "Processing..." : "Apply Filters"}
      </Button>
    </div>
  );
}
