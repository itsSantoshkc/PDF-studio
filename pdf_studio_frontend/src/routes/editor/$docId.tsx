import React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useDocument } from "@/hooks/useDocuments";
import { useEditorStore } from "@/stores/editorStore";
import { PageList } from "@/components/editor/PageList";
import { ToolPanel } from "@/components/editor/ToolPanel";
import { FilterPanel } from "@/components/editor/FilterPanel";
import { CanvasRenderer } from "@/components/editor/CanvasRenderer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

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

  const handleApplyFilters = (filters: unknown) => {
    console.log("Apply filters:", filters);
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
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-64 border-r flex flex-col">
            <ToolPanel />
            <div className="flex-1 overflow-hidden">
              <PageList />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <CanvasRenderer fileUrl={document.original_file} />
        </div>

        <div className="w-72 border-l overflow-y-auto">
          <FilterPanel onApplyFilters={handleApplyFilters} />
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/editor/$docId")({
  component: Editor,
});
