export type DocumentStatus = "draft" | "processing" | "ready" | "failed";

export interface Document {
  id: string;
  owner: string;
  title: string;
  description: string;
  status: DocumentStatus;
  original_file: string;
  file_size: number;
  page_count: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  document: string;
  page_number: number;
  image: string;
  thumbnail: string | null;
  ocr_text: string;
  width: number;
  height: number;
  created_at: string;
}

export interface DocumentVersion {
  id: string;
  document: string;
  version_number: number;
  file: string;
  file_size: number;
  changes_summary: string;
  created_at: string;
  created_by: string;
}

export interface DocumentDetail extends Document {
  pages: Page[];
  versions: DocumentVersion[];
}
