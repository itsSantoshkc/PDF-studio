import React from "react";
import { X, CheckCircle2, AlertCircle, File, Loader2 } from "lucide-react";
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

  const pendingCount = files.filter((f) => f.status === "pending").length;

  return (
    <div className="border-4 border-black bg-white p-6 shadow-neo">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold uppercase tracking-wider">
          Upload Queue
          <span className="ml-2 inline-flex items-center justify-center w-6 h-6 border-2 border-black bg-neo-yellow text-xs">
            {files.length}
          </span>
        </h3>
        <Button variant="ghost" size="sm" onClick={onClear} disabled={isUploading}>
          Clear All
        </Button>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 p-3 border-3 border-black bg-gray-50 transition-all"
          >
            <div className="w-10 h-10 border-2 border-black bg-white flex items-center justify-center shrink-0">
              <File className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-sm truncate">{file.file.name}</p>
                <span className="font-mono text-xs text-muted-foreground shrink-0">
                  {formatFileSize(file.file.size)}
                </span>
              </div>

              {file.status === "uploading" && (
                <Progress value={file.progress} className="mt-2" />
              )}

              {file.status === "error" && (
                <p className="font-mono text-xs text-neo-pink mt-1">{file.error}</p>
              )}
            </div>

            <div className="shrink-0">
              {file.status === "success" && (
                <div className="w-8 h-8 border-2 border-black bg-neo-green flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              )}
              {file.status === "error" && (
                <div className="w-8 h-8 border-2 border-black bg-neo-pink flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-white" />
                </div>
              )}
              {file.status === "uploading" && (
                <div className="w-8 h-8 border-2 border-black bg-neo-blue flex items-center justify-center">
                  <Loader2 className="h-4 w-4 text-white animate-spin" />
                </div>
              )}
              {file.status === "pending" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
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

      <Button
        onClick={onUpload}
        disabled={isUploading || pendingCount === 0}
        className="w-full"
        size="lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          `Upload ${pendingCount} file${pendingCount !== 1 ? "s" : ""}`
        )}
      </Button>
    </div>
  );
}
