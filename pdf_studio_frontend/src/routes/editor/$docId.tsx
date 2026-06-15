import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDocument } from "@/hooks/useDocuments";
import { useEditorStore } from "@/stores/editorStore";
import { PageList } from "@/components/editor/PageList";
import { ToolPanel } from "@/components/editor/ToolPanel";
import { FilterPanel } from "@/components/editor/FilterPanel";
import { CanvasRenderer } from "@/components/editor/CanvasRenderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Zap } from "lucide-react";

function Editor() {
  const { docId } = Route.useParams();
  const navigate = useNavigate();
  const { data: document, isLoading } = useDocument(docId);
  const { pages, setPages, sidebarOpen, toggleSidebar } = useEditorStore();

  React.useEffect(() => {
    if (document?.pages) {
      setPages(
        document.pages.map((p) => ({
          ...p,
          selected: false,
          rotation: 0,
        }))
      );
    }
  }, [document, setPages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neo-yellow neo-grid">
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

  const handleApplyFilters = (filters: unknown) => {
    console.log("Apply filters:", filters);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-neo-yellow">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center">
              <Zap className="h-5 w-5 text-neo-yellow" />
            </div>
            <div>
              <h1 className="text-lg font-bold uppercase tracking-tight">{document.title}</h1>
              <p className="font-mono text-xs text-muted-foreground">
                {document.page_count} pages
              </p>
            </div>
          </div>
        </div>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-72 border-r-4 border-black flex flex-col bg-white">
            <ToolPanel />
            <div className="flex-1 overflow-hidden">
              <PageList />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 neo-dots">
          <CanvasRenderer fileUrl={document.original_file} />
        </div>

        <div className="w-80 border-l-4 border-black overflow-y-auto bg-white">
          <FilterPanel onApplyFilters={handleApplyFilters} />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/editor/$docId")({
  component: Editor,
});
