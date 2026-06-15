import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDocument } from "@/hooks/useDocuments";
import { PDFViewer } from "@/components/viewer/PDFViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Zap } from "lucide-react";

function Viewer() {
  const { docId } = Route.useParams();
  const navigate = useNavigate();
  const { data: document, isLoading } = useDocument(docId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neo-blue neo-grid">
        <div className="border-4 border-black bg-white p-8 shadow-neo-xl">
          <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent animate-spin" />
          <p className="mt-4 font-mono text-sm uppercase tracking-wider">Loading document...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neo-pink neo-dots gap-6">
        <div className="border-4 border-black bg-white p-8 shadow-neo-xl text-center">
          <p className="text-xl font-bold uppercase mb-4">Document not found</p>
          <Button onClick={() => navigate({ to: "/" })}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
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
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-neo-blue">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white border-black"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <Zap className="h-5 w-5 text-neo-blue" />
            </div>
            <div>
              <h1 className="text-lg font-bold uppercase tracking-tight text-white">{document.title}</h1>
              <p className="font-mono text-xs text-white/70">
                {document.page_count} pages
              </p>
            </div>
          </div>
        </div>
        <Button variant="secondary" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </header>

      <div className="flex-1 overflow-hidden bg-gray-100 neo-dots">
        <PDFViewer fileUrl={document.original_file} />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/viewer/$docId")({
  component: Viewer,
});
