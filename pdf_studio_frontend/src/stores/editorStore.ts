import { create } from "zustand";
import type { EditorPage, Tool } from "@/types/editor";

interface EditorState {
  pages: EditorPage[];
  selectedPages: string[];
  currentTool: Tool;
  zoom: number;
  sidebarOpen: boolean;
  processingQueue: string[];

  setPages: (pages: EditorPage[]) => void;
  addPage: (page: EditorPage) => void;
  removePage: (pageId: string) => void;
  reorderPages: (activeId: string, overId: string) => void;
  selectPage: (pageId: string, multi?: boolean) => void;
  selectAllPages: () => void;
  deselectAllPages: () => void;
  setTool: (tool: Tool) => void;
  setZoom: (zoom: number) => void;
  toggleSidebar: () => void;
  rotatePages: (angle: number) => void;
  addToProcessingQueue: (pageId: string) => void;
  removeFromProcessingQueue: (pageId: string) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  pages: [],
  selectedPages: [],
  currentTool: "select",
  zoom: 1,
  sidebarOpen: true,
  processingQueue: [],

  setPages: (pages) => set({ pages }),

  addPage: (page) =>
    set((state) => ({
      pages: [...state.pages, page],
    })),

  removePage: (pageId) =>
    set((state) => ({
      pages: state.pages.filter((p) => p.id !== pageId),
      selectedPages: state.selectedPages.filter((id) => id !== pageId),
    })),

  reorderPages: (activeId, overId) =>
    set((state) => {
      const oldIndex = state.pages.findIndex((p) => p.id === activeId);
      const newIndex = state.pages.findIndex((p) => p.id === overId);

      if (oldIndex === -1 || newIndex === -1) return state;

      const newPages = [...state.pages];
      const [removed] = newPages.splice(oldIndex, 1);
      newPages.splice(newIndex, 0, removed);

      return { pages: newPages };
    }),

  selectPage: (pageId, multi = false) =>
    set((state) => {
      if (multi) {
        const isSelected = state.selectedPages.includes(pageId);
        return {
          selectedPages: isSelected
            ? state.selectedPages.filter((id) => id !== pageId)
            : [...state.selectedPages, pageId],
        };
      }
      return { selectedPages: [pageId] };
    }),

  selectAllPages: () =>
    set((state) => ({
      selectedPages: state.pages.map((p) => p.id),
    })),

  deselectAllPages: () => set({ selectedPages: [] }),

  setTool: (tool) => set({ currentTool: tool }),

  setZoom: (zoom) => set({ zoom: Math.max(0.25, Math.min(4, zoom)) }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  rotatePages: (angle) =>
    set((state) => ({
      pages: state.pages.map((p) =>
        state.selectedPages.includes(p.id)
          ? { ...p, rotation: (p.rotation + angle) % 360 }
          : p
      ),
    })),

  addToProcessingQueue: (pageId) =>
    set((state) => ({
      processingQueue: [...state.processingQueue, pageId],
    })),

  removeFromProcessingQueue: (pageId) =>
    set((state) => ({
      processingQueue: state.processingQueue.filter((id) => id !== pageId),
    })),
}));
