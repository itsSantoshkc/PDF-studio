import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useEditorStore } from "@/stores/editorStore";
import type { EditorPage } from "@/types/editor";

interface PageThumbnailProps {
  page: EditorPage;
  index: number;
}

export function PageThumbnail({ page, index }: PageThumbnailProps) {
  const { selectedPages, selectPage } = useEditorStore();
  const isSelected = selectedPages.includes(page.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer transition-all",
        "hover:bg-accent/50",
        isSelected && "bg-accent ring-2 ring-primary",
        isDragging && "opacity-50"
      )}
      onClick={(e) => selectPage(page.id, e.metaKey || e.ctrlKey)}
      {...attributes}
      {...listeners}
    >
      <div className="absolute top-2 left-2 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => selectPage(page.id)}
        />
      </div>

      <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 rounded px-1">
        {index + 1}
      </div>

      <div
        className="w-full aspect-[1/1.414] bg-muted rounded overflow-hidden"
        style={{ transform: `rotate(${page.rotation}deg)` }}
      >
        {page.thumbnail ? (
          <img
            src={page.thumbnail}
            alt={`Page ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
            {page.page_number}
          </div>
        )}
      </div>

      <div className="text-xs text-muted-foreground truncate w-full text-center">
        Page {page.page_number}
      </div>
    </div>
  );
}
