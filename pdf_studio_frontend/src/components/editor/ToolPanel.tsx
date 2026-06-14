import React from "react";
import {
  MousePointer2,
  RotateCw,
  Trash2,
  Sparkles,
  ScanText,
  MoveVertical,
} from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/editor";

const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "rotate", icon: RotateCw, label: "Rotate" },
  { id: "delete", icon: Trash2, label: "Delete" },
  { id: "enhance", icon: Sparkles, label: "Enhance" },
  { id: "ocr", icon: ScanText, label: "OCR" },
  { id: "dewarp", icon: MoveVertical, label: "Dewarp" },
];

export function ToolPanel() {
  const { currentTool, setTool } = useEditorStore();

  return (
    <div className="flex flex-col gap-1 p-2 border-b">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <Button
            key={tool.id}
            variant={currentTool === tool.id ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "justify-start gap-2",
              currentTool === tool.id && "bg-accent"
            )}
            onClick={() => setTool(tool.id)}
            title={tool.label}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{tool.label}</span>
          </Button>
        );
      })}
    </div>
  );
}
