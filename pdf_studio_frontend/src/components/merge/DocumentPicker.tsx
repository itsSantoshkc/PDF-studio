import React from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { Input } from "@/components/ui/input";
import { File, Search, Check } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DocumentPickerProps {
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function DocumentPicker({ selectedIds, onToggle }: DocumentPickerProps) {
  const [search, setSearch] = React.useState("");
  const { data, isLoading } = useDocuments({
    status: "ready",
    search: search || undefined,
  });

  const documents = data?.results ?? [];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10"
        />
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 border-4 border-dashed border-black">
            <File className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              No documents found
            </p>
          </div>
        ) : (
          documents.map((doc) => {
            const isSelected = selectedIds.includes(doc.id);
            return (
              <button
                key={doc.id}
                className={cn(
                  "w-full flex items-center gap-3 p-3 border-3 border-black transition-all text-left",
                  "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo",
                  isSelected ? "bg-neo-yellow shadow-neo" : "bg-white shadow-neo-sm"
                )}
                onClick={() => onToggle(doc.id)}
              >
                <div className={cn(
                  "w-6 h-6 border-2 border-black flex items-center justify-center shrink-0",
                  isSelected ? "bg-black" : "bg-white"
                )}>
                  {isSelected && <Check className="h-4 w-4 text-white" />}
                </div>

                <div className="w-10 h-10 border-2 border-black bg-gray-100 flex items-center justify-center shrink-0">
                  <File className="h-5 w-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{doc.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {doc.page_count} pages • {formatFileSize(doc.file_size)}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="border-2 border-black bg-neo-yellow p-3 text-center">
          <span className="font-mono text-xs font-bold uppercase tracking-wider">
            {selectedIds.length} document{selectedIds.length !== 1 ? "s" : ""} selected
          </span>
        </div>
      )}
    </div>
  );
}
