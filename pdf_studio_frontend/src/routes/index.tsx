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
import { File, Trash2, Edit, Eye, Zap, Upload, Settings } from "lucide-react";
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
    <div className="min-h-screen bg-white neo-grid">
      <header className="border-b-4 border-black bg-neo-yellow">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <Zap className="h-6 w-6 text-neo-yellow" />
            </div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter">PDF Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/settings" })}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <div className="border-3 border-black bg-white px-4 py-2 shadow-neo-sm">
              <span className="font-mono text-sm">{user?.email}</span>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-neo-pink border-3 border-black flex items-center justify-center">
                <Upload className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tight">Upload Documents</h2>
            </div>
            <DropZone onFilesAdded={addFiles} disabled={isUploading} />
            {hasFiles && (
              <div className="mt-6">
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-neo-blue border-3 border-black flex items-center justify-center">
                <File className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tight">Your Documents</h2>
              <Badge variant="default">{documents.length}</Badge>
            </div>

            {isLoading ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent animate-spin" />
                  <p className="mt-4 font-mono text-sm uppercase tracking-wider">Loading documents...</p>
                </CardContent>
              </Card>
            ) : documents.length === 0 ? (
              <Card className="neo-dots">
                <CardContent className="py-16 text-center">
                  <div className="inline-flex w-20 h-20 border-4 border-black bg-neo-yellow items-center justify-center mb-6">
                    <File className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold uppercase mb-2">No documents yet</h3>
                  <p className="font-mono text-sm text-muted-foreground">
                    Upload your first PDF to get started
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                  <Card key={doc.id} className="neo-card-hover group">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base truncate">{doc.title}</CardTitle>
                        <Badge variant={doc.status === "ready" ? "success" : doc.status === "processing" ? "secondary" : "muted"}>
                          {doc.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        <p className="font-mono text-xs text-muted-foreground">
                          {doc.page_count} pages • {formatFileSize(doc.file_size)}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {formatDate(doc.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-2">
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
                          variant="destructive"
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
