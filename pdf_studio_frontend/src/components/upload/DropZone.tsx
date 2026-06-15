import React, { useCallback, useState } from "react";
import { Upload, File, ArrowUpFromLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFilesAdded: (files: FileList | File[]) => void;
  disabled?: boolean;
}

export function DropZone({ onFilesAdded, disabled = false }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
    }
  }, [disabled, onFilesAdded]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.pdf';
    input.onchange = (e) => {
      if (e.target.files?.length) onFilesAdded(e.target.files);
    };
    input.click();
  }, [disabled, onFilesAdded]);

  return (
    <div
      className={cn(
        "relative border-4 border-dashed border-black p-12 cursor-pointer transition-all duration-200",
        isDragOver ? "bg-neo-yellow border-solid shadow-neo-xl scale-[1.02]" : "bg-white hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center gap-4">
        <div className={cn(
          "w-16 h-16 border-4 border-black flex items-center justify-center transition-all",
          isDragOver ? "bg-neo-yellow rotate-12" : "bg-gray-100"
        )}>
          {isDragOver ? (
            <ArrowUpFromLine className="h-8 w-8" />
          ) : (
            <Upload className="h-8 w-8" />
          )}
        </div>
        <div className="text-center">
          <p className="font-bold uppercase tracking-wider text-lg">
            {isDragOver ? "Drop here!" : "Drop PDF here"}
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            or click to browse
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <File className="h-4 w-4" />
          <span>PDF files only</span>
        </div>
      </div>
    </div>
  );
}
