import fileDownload from "js-file-download";
import { generatePdf } from "./generatePdf";

export function triggerDownload(data, filename, mimetype) {
  fileDownload(data, filename, mimetype);
}

export async function downloadPage(page) {
  const pdf = await generatePdf(page);

  triggerDownload(pdf, "test.pdf", "application/pdf");
}
