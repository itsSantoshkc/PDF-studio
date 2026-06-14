import {
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  arrayMove,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

export function handleDragEnd(
  event: DragEndEvent,
  items: string[],
  onReorder: (oldIndex: number, newIndex: number) => void
) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = items.indexOf(active.id as string);
  const newIndex = items.indexOf(over.id as string);

  if (oldIndex !== -1 && newIndex !== -1) {
    onReorder(oldIndex, newIndex);
  }
}

export function handleDragStart(
  _event: DragStartEvent,
  setActiveId: (id: string | null) => void
) {
  setActiveId(_event.active.id as string);
}

export function handleDragOver(
  _event: DragOverEvent,
  _setActiveId: (id: string | null) => void
) {
  // Handle drag over if needed
}

export { arrayMove, sortableKeyboardCoordinates };
