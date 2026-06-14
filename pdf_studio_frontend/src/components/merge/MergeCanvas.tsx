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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MergeDocument {
  id: string;
  title: string;
  pageCount: number;
}

interface MergeCanvasProps {
  documents: MergeDocument[];
  onReorder: (oldIndex: number, newIndex: number) => void;
  onRemove: (id: string) => void;
}

function SortableDocument({ doc, onRemove }: { doc: MergeDocument; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: doc.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card",
        isDragging && "opacity-50"
      )}
    >
      <button className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{doc.title}</p>
        <p className="text-xs text-muted-foreground">
          {doc.pageCount} {doc.pageCount === 1 ? "page" : "pages"}
        </p>
      </div>

      <Button variant="ghost" size="icon" onClick={() => onRemove(doc.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function MergeCanvas({ documents, onReorder, onRemove }: MergeCanvasProps) {
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
      const oldIndex = documents.findIndex((d) => d.id === active.id);
      const newIndex = documents.findIndex((d) => d.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  }

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p>No documents selected</p>
        <p className="text-sm mt-1">Add documents to merge from the sidebar</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={documents.map((d) => d.id)} strategy={rectSortingStrategy}>
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
            <SortableDocument key={doc.id} doc={doc} onRemove={onRemove} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
