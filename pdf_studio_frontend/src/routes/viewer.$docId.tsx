import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDocument } from "@/hooks/useDocuments";
import { PDFViewer } from "@/components/viewer/PDFViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

function Viewer() {
  const { docId } = Route.useParams();
  const navigate = useNavigate();
  const { data: document, isLoading } = useDocument(docId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading document...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p className="text-muted-foreground">Document not found</p>
        <Button onClick={() => navigate({ to: "/" })}>Go Back</Button>
      </div>
    );
  }

  const handleDownload = () => {
    const link = window.document.createElement("a");
    link.href = document.original_file;
    link.download = document.title;
    link.click();
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{document.title}</h1>
            <p className="text-sm text-muted-foreground">
              {document.page_count} pages
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </header>

      <div className="flex-1 overflow-hidden">
        <PDFViewer fileUrl={document.original_file} />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/viewer/$docId")({
  component: Viewer,
});
