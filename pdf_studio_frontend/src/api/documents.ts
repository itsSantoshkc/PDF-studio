import client from "./client";
import type { Document, DocumentDetail } from "@/types/document";

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface DocumentFilters {
  status?: string;
  is_public?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

export const documentsApi = {
  list: async (filters?: DocumentFilters): Promise<PaginatedResponse<Document>> => {
    const response = await client.get("/documents/", { params: filters });
    return response.data;
  },

  get: async (id: string): Promise<DocumentDetail> => {
    const response = await client.get(`/documents/${id}/`);
    return response.data;
  },

  create: async (data: FormData): Promise<Document> => {
    const response = await client.post("/documents/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  update: async (id: string, data: Partial<Document>): Promise<Document> => {
    const response = await client.patch(`/documents/${id}/`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/documents/${id}/`);
  },

  duplicate: async (id: string): Promise<DocumentDetail> => {
    const response = await client.post(`/documents/${id}/duplicate/`);
    return response.data;
  },

  getPages: async (id: string) => {
    const response = await client.get(`/documents/${id}/pages/`);
    return response.data;
  },

  getVersions: async (id: string) => {
    const response = await client.get(`/documents/${id}/versions/`);
    return response.data;
  },

  getShared: async (filters?: DocumentFilters): Promise<PaginatedResponse<Document>> => {
    const response = await client.get("/documents/shared/", { params: filters });
    return response.data;
  },
};
