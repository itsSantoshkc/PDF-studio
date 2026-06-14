import React, { useRef, useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { loadPdfDocument, renderPageToCanvas } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw } from "lucide-react";

interface CanvasRendererProps {
  fileUrl: string;
}

export function CanvasRenderer({ fileUrl }: CanvasRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pages, selectedPages, zoom, setZoom, rotatePages } = useEditorStore();
  const [isLoading, setIsLoading] = useState(true);

  const selectedPage = pages.find((p) => selectedPages.includes(p.id));
  const pageNumber = selectedPage?.page_number ?? 1;

  useEffect(() => {
    async function renderPage() {
      if (!canvasRef.current || !fileUrl) return;

      setIsLoading(true);
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const pdfDocument = await loadPdfDocument(arrayBuffer);
        await renderPageToCanvas(pdfDocument, pageNumber, canvasRef.current, zoom);
      } catch (error) {
        console.error("Failed to render page:", error);
      } finally {
        setIsLoading(false);
      }
    }

    renderPage();
  }, [fileUrl, pageNumber, zoom]);

  const handleZoomIn = () => setZoom(zoom + 0.25);
  const handleZoomOut = () => setZoom(zoom - 0.25);
  const handleRotate = () => rotatePages(90);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" onClick={handleRotate}>
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto bg-muted/50 flex items-center justify-center p-4">
        {isLoading ? (
          <div className="text-muted-foreground">Loading page...</div>
        ) : (
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full shadow-lg"
            style={{
              transform: `rotate(${selectedPage?.rotation ?? 0}deg)`,
            }}
          />
        )}
      </div>
    </div>
  );
}
