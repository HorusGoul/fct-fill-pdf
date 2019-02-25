import fileDownload from "js-file-download";

export function triggerDownload(data, filename, mimetype) {
  fileDownload(data, filename, mimetype);
}
