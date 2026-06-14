import client from "./client";

interface TaskResponse {
  task_id: string;
  status: string;
  document_id?: string;
  page_id?: string;
}

interface TaskStatus {
  task_id: string;
  status: string;
  result: unknown;
}

export const processingApi = {
  processDocument: async (documentId: string): Promise<TaskResponse> => {
    const response = await client.post("/processing/process_document/", {
      document_id: documentId,
    });
    return response.data;
  },

  runOcr: async (pageId: string, engine = "tesseract"): Promise<TaskResponse> => {
    const response = await client.post("/processing/run_ocr/", {
      page_id: pageId,
      engine,
    });
    return response.data;
  },

  enhance: async (pageId: string): Promise<TaskResponse> => {
    const response = await client.post("/processing/enhance/", {
      page_id: pageId,
    });
    return response.data;
  },

  dewarp: async (pageId: string): Promise<TaskResponse> => {
    const response = await client.post("/processing/dewarp/", {
      page_id: pageId,
    });
    return response.data;
  },

  getTaskStatus: async (taskId: string): Promise<TaskStatus> => {
    const response = await client.get(`/processing/task_status/`, {
      params: { task_id: taskId },
    });
    return response.data;
  },
};
