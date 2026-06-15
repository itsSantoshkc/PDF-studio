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
import { GripVertical, X, File } from "lucide-react";
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
        "flex items-center gap-3 p-3 border-3 border-black bg-white transition-all",
        isDragging && "opacity-50 z-50 shadow-neo-lg"
      )}
    >
      <button
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-neo-yellow transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="w-10 h-10 border-2 border-black bg-gray-100 flex items-center justify-center shrink-0">
        <File className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate">{doc.title}</p>
        <p className="font-mono text-xs text-muted-foreground">
          {doc.pageCount} {doc.pageCount === 1 ? "page" : "pages"}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 shrink-0"
        onClick={() => onRemove(doc.id)}
      >
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
      <div className="flex flex-col items-center justify-center h-64 border-4 border-dashed border-black bg-gray-50">
        <File className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="font-bold uppercase tracking-wider">No documents selected</p>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          Add documents from the sidebar
        </p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={documents.map((d) => d.id)} strategy={rectSortingStrategy}>
        <div className="space-y-2">
          {documents.map((doc, index) => (
            <div key={doc.id} className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold w-6 text-center border-2 border-black bg-neo-yellow">
                {index + 1}
              </span>
              <div className="flex-1">
                <SortableDocument doc={doc} onRemove={onRemove} />
              </div>
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
