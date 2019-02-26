import fileDownload from "js-file-download";
import JSZip from "jszip";
import { generatePdf } from "./generatePdf";

export function triggerDownload(data, filename, mimetype) {
  fileDownload(data, filename, mimetype);
}

export async function downloadPage(page) {
  const pdf = await generatePdf(page);

  triggerDownload(pdf, page.__meta.fileName, "application/pdf");
}

export async function downloadMultiplePages(pages) {
  const zip = new JSZip();

  for (let page of pages) {
    const pdf = await generatePdf(page);

    zip.file(page.__meta.fileName, pdf);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  triggerDownload(blob, "fct.zip", "application/zip");
}
