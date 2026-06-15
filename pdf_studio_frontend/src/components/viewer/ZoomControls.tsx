import React from "react";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onZoomReset }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onZoomOut}>
        <ZoomOut className="h-4 w-4" />
      </Button>
      <span className="font-mono text-sm font-bold min-w-[4rem] text-center border-2 border-black px-2 py-1 bg-neo-yellow">
        {Math.round(zoom * 100)}%
      </span>
      <Button variant="outline" size="sm" onClick={onZoomIn}>
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="sm" onClick={onZoomReset}>
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
