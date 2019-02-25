const pdfform = window.pdfform;

async function fetchSourcePdf() {
  return fetch("./source.pdf").then(data => data.arrayBuffer());
}

function applyFillFormat(page) {
  const newPage = {};

  for (let key in page) {
    newPage[key] = [page[key]];
  }

  return newPage;
}

export async function generatePdf(page) {
  const fillData = applyFillFormat(page);

  const source = await fetchSourcePdf();
  const outputBuffer = pdfform().transform(source, fillData);
  const outputBlob = new Blob([outputBuffer], { type: "application/pdf" });

  return outputBlob;
}
