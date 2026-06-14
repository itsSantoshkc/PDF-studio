import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export async function loadPdfDocument(data: ArrayBuffer) {
  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDocument = await loadingTask.promise;
  return pdfDocument;
}

export async function renderPageToCanvas(
  pdfDocument: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale = 1
) {
  const page = await pdfDocument.getPage(pageNumber);
  const viewport = page.getViewport({ scale });

  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport,
  }).promise;
}

export async function getPageDimensions(
  pdfDocument: pdfjsLib.PDFDocumentProxy,
  pageNumber: number
) {
  const page = await pdfDocument.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 1 });
  return {
    width: viewport.width,
    height: viewport.height,
  };
}

export async function extractTextFromPage(
  pdfDocument: pdfjsLib.PDFDocumentProxy,
  pageNumber: number
) {
  const page = await pdfDocument.getPage(pageNumber);
  const textContent = await page.getTextContent();
  return textContent.items
    .map((item) => ("str" in item ? item.str : ""))
    .join(" ");
}
