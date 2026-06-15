import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useEditorStore } from "@/stores/editorStore";
import { PageThumbnail } from "./PageThumbnail";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square, Layers } from "lucide-react";

export function PageList() {
  const { pages, reorderPages, selectAllPages, deselectAllPages, selectedPages } =
    useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderPages(active.id as string, over.id as string);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b-3 border-black">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          <span className="font-mono text-xs uppercase tracking-wider">
            {pages.length} {pages.length === 1 ? "page" : "pages"}
          </span>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={selectAllPages}
            disabled={selectedPages.length === pages.length}
            title="Select all"
          >
            <CheckSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={deselectAllPages}
            disabled={selectedPages.length === 0}
            title="Deselect all"
          >
            <Square className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pages.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-3">
              {pages.map((page, index) => (
                <PageThumbnail key={page.id} page={page} index={index} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
