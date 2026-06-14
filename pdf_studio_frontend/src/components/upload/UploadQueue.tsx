import React from "react";
import { X, CheckCircle, AlertCircle, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatFileSize } from "@/lib/utils";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

interface UploadQueueProps {
  files: UploadFile[];
  onRemove: (id: string) => void;
  onUpload: () => void;
  onClear: () => void;
  isUploading: boolean;
}

export function UploadQueue({ files, onRemove, onUpload, onClear, isUploading }: UploadQueueProps) {
  if (files.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Upload Queue ({files.length} {files.length === 1 ? "file" : "files"})
        </h3>
        <Button variant="ghost" size="sm" onClick={onClear} disabled={isUploading}>
          Clear All
        </Button>
      </div>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 p-3 rounded-lg border bg-card"
          >
            <File className="h-5 w-5 text-muted-foreground shrink-0" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium truncate">{file.file.name}</p>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatFileSize(file.file.size)}
                </span>
              </div>

              {file.status === "uploading" && (
                <Progress value={file.progress} className="h-1 mt-2" />
              )}

              {file.status === "error" && (
                <p className="text-xs text-destructive mt-1">{file.error}</p>
              )}
            </div>

            <div className="shrink-0">
              {file.status === "success" && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {file.status === "error" && (
                <AlertCircle className="h-5 w-5 text-destructive" />
              )}
              {(file.status === "pending" || file.status === "uploading") && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(file.id)}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onUpload} disabled={isUploading || files.every((f) => f.status !== "pending")}>
        {isUploading ? "Uploading..." : "Upload Files"}
      </Button>
    </div>
  );
}
