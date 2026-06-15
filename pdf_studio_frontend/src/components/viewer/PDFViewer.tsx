import React, { useRef, useEffect, useState } from "react";
import { loadPdfDocument, renderPageToCanvas } from "@/lib/pdf";
import { ZoomControls } from "./ZoomControls";
import { PageNav } from "./PageNav";

interface PDFViewerProps {
  fileUrl: string;
}

export function PDFViewer({ fileUrl }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDocument, setPdfDocument] = useState<Awaited<ReturnType<typeof loadPdfDocument>> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDocument() {
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const doc = await loadPdfDocument(arrayBuffer);
        setPdfDocument(doc);
        setTotalPages(doc.numPages);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load PDF:", error);
        setIsLoading(false);
      }
    }

    loadDocument();
  }, [fileUrl]);

  useEffect(() => {
    async function renderPage() {
      if (!canvasRef.current || !pdfDocument) return;

      try {
        await renderPageToCanvas(pdfDocument, currentPage, canvasRef.current, zoom);
      } catch (error) {
        console.error("Failed to render page:", error);
      }
    }

    renderPage();
  }, [pdfDocument, currentPage, zoom]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(4, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(0.25, prev - 0.25));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="border-4 border-black bg-white p-8 shadow-neo-xl">
          <div className="inline-block w-8 h-8 border-4 border-black border-t-transparent animate-spin" />
          <p className="mt-4 font-mono text-sm uppercase tracking-wider">Loading PDF...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b-3 border-black bg-white">
        <PageNav
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
          onPageChange={setCurrentPage}
        />
        <ZoomControls
          zoom={zoom}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onZoomReset={handleZoomReset}
        />
      </div>

      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <div className="border-4 border-black bg-white shadow-neo-xl p-2">
          <canvas
            ref={canvasRef}
            className="max-w-full max-h-full"
          />
        </div>
      </div>
    </div>
  );
}
