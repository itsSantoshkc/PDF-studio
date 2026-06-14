import React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { useDocuments, useDeleteDocument } from "@/hooks/useDocuments";
import { useUpload } from "@/hooks/useUpload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropZone } from "@/components/upload/DropZone";
import { UploadQueue } from "@/components/upload/UploadQueue";
import { File, Trash2, Edit, Eye, Copy } from "lucide-react";
import { formatFileSize, formatDate } from "@/lib/utils";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { data, isLoading } = useDocuments();
  const deleteDocument = useDeleteDocument();
  const { files, addFiles, removeFile, clearFiles, uploadFiles, isUploading, hasFiles } = useUpload();

  const documents = data?.results ?? [];

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">PDF Studio</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          <section>
            <h2 className="text-lg font-semibold mb-4">Upload Documents</h2>
            <DropZone onFilesAdded={addFiles} disabled={isUploading} />
            {hasFiles && (
              <div className="mt-4">
                <UploadQueue
                  files={files}
                  onRemove={removeFile}
                  onUpload={uploadFiles}
                  onClear={clearFiles}
                  isUploading={isUploading}
                />
              </div>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4">Your Documents</h2>

            {isLoading ? (
              <p className="text-muted-foreground">Loading documents...</p>
            ) : documents.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No documents yet</p>
                  <p className="text-sm mt-1">Upload your first PDF to get started</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                  <Card key={doc.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base truncate">
                          {doc.title}
                        </CardTitle>
                        <Badge variant={doc.status === "ready" ? "default" : "secondary"}>
                          {doc.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{doc.page_count} pages • {formatFileSize(doc.file_size)}</p>
                        <p>{formatDate(doc.created_at)}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate({ to: "/viewer/$docId", params: { docId: doc.id } })}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate({ to: "/editor/$docId", params: { docId: doc.id } })}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteDocument.mutate(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Dashboard,
});
