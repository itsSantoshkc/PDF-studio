import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
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
        "relative flex flex-col items-center gap-2 p-2 border-3 border-black cursor-pointer transition-all duration-100",
        "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo",
        isSelected && "bg-neo-yellow shadow-neo",
        isDragging && "opacity-50 z-50"
      )}
      onClick={(e) => selectPage(page.id, e.metaKey || e.ctrlKey)}
      {...attributes}
      {...listeners}
    >
      <div className="absolute top-2 left-2 z-10">
        <div className={cn(
          "w-5 h-5 border-2 border-black flex items-center justify-center",
          isSelected ? "bg-black" : "bg-white"
        )}>
          {isSelected && (
            <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={4}>
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </div>
      </div>

      <div className="absolute top-2 right-2 font-mono text-xs bg-white border-2 border-black px-1">
        {index + 1}
      </div>

      <div
        className="w-full aspect-[1/1.414] bg-gray-100 border-2 border-black overflow-hidden"
        style={{ transform: `rotate(${page.rotation}deg)` }}
      >
        {page.thumbnail ? (
          <img
            src={page.thumbnail}
            alt={`Page ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted-foreground">
            {page.page_number}
          </div>
        )}
      </div>

      <div className="font-mono text-xs text-muted-foreground truncate w-full text-center">
        Page {page.page_number}
      </div>
    </div>
  );
}
