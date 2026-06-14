import React from "react";
import { useDocuments } from "@/hooks/useDocuments";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { File, Search } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/badge";

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
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No documents found
          </div>
        ) : (
          documents.map((doc) => (
            <label
              key={doc.id}
              className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
            >
              <Checkbox
                checked={selectedIds.includes(doc.id)}
                onCheckedChange={() => onToggle(doc.id)}
              />

              <File className="h-5 w-5 text-muted-foreground shrink-0" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{doc.title}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.page_count} pages • {formatFileSize(doc.file_size)}
                </p>
              </div>
            </label>
          ))
        )}
      </div>

      {selectedIds.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedIds.length} document{selectedIds.length !== 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
