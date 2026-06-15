import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MergeCanvas } from "@/components/merge/MergeCanvas";
import { DocumentPicker } from "@/components/merge/DocumentPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Merge, Zap, Layers } from "lucide-react";

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
    <div className="min-h-screen bg-neo-orange neo-dots">
      <header className="flex items-center justify-between px-6 py-4 border-b-4 border-black bg-white">
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
              <Zap className="h-5 w-5 text-neo-orange" />
            </div>
            <h1 className="text-xl font-bold uppercase tracking-tight">Merge Documents</h1>
          </div>
        </div>
        <Button
          onClick={handleMerge}
          disabled={selectedDocs.length < 2}
          size="lg"
        >
          <Merge className="h-5 w-5 mr-2" />
          Merge {selectedDocs.length > 0 ? `${selectedDocs.length} ` : ""}Documents
        </Button>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-96 border-r-4 border-black p-4 overflow-y-auto bg-white">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="h-5 w-5" />
            <h2 className="font-bold uppercase tracking-wider">Available Documents</h2>
          </div>
          <DocumentPicker
            selectedIds={selectedDocs.map((d) => d.id)}
            onToggle={handleToggleDoc}
          />
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          <Card className="neo-card-hover">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neo-yellow border-2 border-black flex items-center justify-center">
                  <Merge className="h-4 w-4" />
                </div>
                <CardTitle>Merge Order</CardTitle>
              </div>
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
