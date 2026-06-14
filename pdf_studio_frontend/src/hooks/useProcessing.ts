import { useMutation, useQueryClient } from "@tanstack/react-query";
import { processingApi } from "@/api/processing";

export function useProcessDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      processingApi.processDocument(documentId),
    onSuccess: (_, documentId) => {
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
    },
  });
}

export function useRunOcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageId, engine }: { pageId: string; engine?: string }) =>
      processingApi.runOcr(pageId, engine),
    onSuccess: (_, { pageId }) => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
  });
}

export function useEnhance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pageId: string) => processingApi.enhance(pageId),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
  });
}

export function useDewarp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pageId: string) => processingApi.dewarp(pageId),
    onSuccess: (_, pageId) => {
      queryClient.invalidateQueries({ queryKey: ["page", pageId] });
    },
  });
}

export function useTaskStatus() {
  return useMutation({
    mutationFn: (taskId: string) => processingApi.getTaskStatus(taskId),
  });
}
