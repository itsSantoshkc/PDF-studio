import React, { useRef, useEffect, useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { loadPdfDocument, renderPageToCanvas } from "@/lib/pdf";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCw, Maximize2 } from "lucide-react";

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
      <div className="flex items-center justify-between p-3 border-b-3 border-black bg-white">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="font-mono text-sm font-bold min-w-[4rem] text-center border-2 border-black px-2 py-1">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setZoom(1)}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={handleRotate}>
          <RotateCw className="h-4 w-4 mr-2" />
          Rotate
        </Button>
      </div>

      <div className="flex-1 overflow-auto bg-gray-200 flex items-center justify-center p-8 neo-grid">
        {isLoading ? (
          <div className="border-4 border-black bg-white p-8 shadow-neo-xl">
            <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent animate-spin" />
            <p className="mt-4 font-mono text-sm uppercase tracking-wider">Loading page...</p>
          </div>
        ) : (
          <div className="border-4 border-black bg-white shadow-neo-xl p-2">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full"
              style={{
                transform: `rotate(${selectedPage?.rotation ?? 0}deg)`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
