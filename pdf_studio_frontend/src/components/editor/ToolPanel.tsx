import React from "react";
import {
  MousePointer2,
  RotateCw,
  Trash2,
  Sparkles,
  ScanText,
  MoveVertical,
  Wrench,
} from "lucide-react";
import { useEditorStore } from "@/stores/editorStore";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types/editor";

const tools: { id: Tool; icon: React.ElementType; label: string; color: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select", color: "bg-white" },
  { id: "rotate", icon: RotateCw, label: "Rotate", color: "bg-neo-yellow" },
  { id: "delete", icon: Trash2, label: "Delete", color: "bg-neo-pink" },
  { id: "enhance", icon: Sparkles, label: "Enhance", color: "bg-neo-green" },
  { id: "ocr", icon: ScanText, label: "OCR", color: "bg-neo-blue" },
  { id: "dewarp", icon: MoveVertical, label: "Dewarp", color: "bg-neo-purple" },
];

export function ToolPanel() {
  const { currentTool, setTool } = useEditorStore();

  return (
    <div className="p-3 border-b-3 border-black">
      <div className="flex items-center gap-2 mb-3">
        <Wrench className="h-4 w-4" />
        <span className="font-mono text-xs uppercase tracking-wider">Tools</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = currentTool === tool.id;
          return (
            <button
              key={tool.id}
              className={cn(
                "flex flex-col items-center gap-1 p-2 border-3 border-black transition-all duration-100",
                "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo",
                isActive ? "shadow-neo-sm translate-x-0.5 translate-y-0.5" : "shadow-neo-sm",
                tool.color
              )}
              onClick={() => setTool(tool.id)}
              title={tool.label}
            >
              <Icon className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-wider">{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
