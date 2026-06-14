import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MergeCanvas } from "@/components/merge/MergeCanvas";
import { DocumentPicker } from "@/components/merge/DocumentPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Merge } from "lucide-react";

function MergeEditor() {
  const { docId } = Route.useParams();
  const navigate = useNavigate();
  const [selectedDocs, setSelectedDocs] = useState<
    Array<{ id: string; title: string; pageCount: number }>
  >([]);

  const handleToggleDoc = (id: string) => {
    setSelectedDocs((prev) => {
      const exists = prev.find((d) => d.id === id);
      if (exists) {
        return prev.filter((d) => d.id !== id);
      }
      return [...prev, { id, title: "Document", pageCount: 0 }];
    });
  };

  const handleReorder = (oldIndex: number, newIndex: number) => {
    setSelectedDocs((prev) => {
      const newDocs = [...prev];
      const [removed] = newDocs.splice(oldIndex, 1);
      newDocs.splice(newIndex, 0, removed);
      return newDocs;
    });
  };

  const handleRemove = (id: string) => {
    setSelectedDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleMerge = () => {
    console.log("Merge documents:", selectedDocs.map((d) => d.id));
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Merge Documents</h1>
        </div>
        <Button
          onClick={handleMerge}
          disabled={selectedDocs.length < 2}
        >
          <Merge className="h-4 w-4 mr-2" />
          Merge {selectedDocs.length} Documents
        </Button>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        <div className="w-80 border-r p-4 overflow-y-auto">
          <DocumentPicker
            selectedIds={selectedDocs.map((d) => d.id)}
            onToggle={handleToggleDoc}
          />
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Merge Order</CardTitle>
            </CardHeader>
            <CardContent>
              <MergeCanvas
                documents={selectedDocs}
                onReorder={handleReorder}
                onRemove={handleRemove}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/editor/$docId.merge")({
  component: MergeEditor,
});
