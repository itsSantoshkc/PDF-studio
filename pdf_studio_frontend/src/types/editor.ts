import type { Page } from "./document";

export type Tool = "select" | "rotate" | "delete" | "enhance" | "ocr" | "dewarp";

export interface EditorPage extends Page {
  selected: boolean;
  rotation: number;
}

export interface EditorState {
  pages: EditorPage[];
  selectedPages: string[];
  currentTool: Tool;
  zoom: number;
  sidebarOpen: boolean;
  processingQueue: string[];
}

export interface FilterOptions {
  brightness: number;
  contrast: number;
  sharpness: number;
  denoise: boolean;
  binarize: boolean;
  deskew: boolean;
}
