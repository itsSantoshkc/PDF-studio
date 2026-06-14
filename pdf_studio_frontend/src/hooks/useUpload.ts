import { useState, useCallback } from "react";
import { useCreateDocument } from "./useDocuments";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export function useUpload() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const createDocument = useCreateDocument();

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      progress: 0,
      status: "pending" as const,
    }));

    setFiles((prev) => [...prev, ...fileArray]);
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
  }, []);

  const uploadFiles = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");

    for (const uploadFile of pendingFiles) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === uploadFile.id ? { ...f, status: "uploading", progress: 0 } : f
        )
      );

      try {
        const formData = new FormData();
        formData.append("original_file", uploadFile.file);
        formData.append("title", uploadFile.file.name.replace(/\.pdf$/i, ""));

        await createDocument.mutateAsync(formData);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "success", progress: 100 } : f
          )
        );
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id
              ? { ...f, status: "error", error: "Upload failed" }
              : f
          )
        );
      }
    }
  }, [files, createDocument]);

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    isUploading: files.some((f) => f.status === "uploading"),
    hasFiles: files.length > 0,
  };
}
