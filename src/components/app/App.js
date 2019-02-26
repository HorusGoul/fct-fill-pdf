import React, { useRef, useState } from "react";
import { parseCsv } from "../../csvParser";
import { processCsvData } from "../../processCsvData";
import { Pages } from "../pages/Pages";

function App() {
  const fileRef = useRef(null);
  const [fileName, setFileName] = useState("Introduce un archivo .csv");
  const [pages, setPages] = useState([]);

  async function onGenerarClick() {
    const fileInput = fileRef.current;
    const file = fileInput.files[0];

    setFileName(file.name);

    const result = await parseCsv(file);
    const csvLines = result.data;

    const pages = processCsvData(csvLines);
    setPages(pages);
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">FCT Filler</h1>
        <h2 className="subtitle">
          Descarga tus actividades con el PDF oficial de la Junta de Andalucía
        </h2>

        <div className="field">
          <span className="label">
            1. Introduce el archivo CSV que se obtiene a partir de la{" "}
            <a href="https://docs.google.com/spreadsheets/d/1peL514fkHFE_xun6l_iAWW9msAXS3S08MuG6iUq8N2g/edit?usp=sharing">
              hoja de calculo
            </a>
            .
          </span>

          <div className="file has-name is-fullwidth is-info">
            <label className="file-label">
              <input
                ref={fileRef}
                className="file-input"
                type="file"
                onChange={onGenerarClick}
                accept=".csv"
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fas fa-upload" />
                </span>
                <span className="file-label">*.csv</span>
              </span>
              <span className="file-name">{fileName}</span>
            </label>
          </div>
        </div>

        <Pages pages={pages} setPages={setPages} />
      </div>
    </section>
  );
}

export default App;
