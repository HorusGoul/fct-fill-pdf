import Papa from "papaparse";

export async function parseCsv(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      complete: result => {
        resolve(result);
      },
      error: error => reject(error),
    });
  });
}
