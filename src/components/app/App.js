import React, { useRef } from "react";
import "./App.css";
import { parseCsv } from "../../csvParser";
import { fillPdf } from "../../fillPdf";

function App() {
  const fileRef = useRef(null);

  async function onGenerarClick() {
    const fileInput = fileRef.current;

    const result = await parseCsv(fileInput.files[0]);
    const csvLines = result.data;

    fillPdf(csvLines);
  }

  return (
    <div>
      <h1>Generar los PDFs de la FCT</h1>

      <div>
        <span>
          Introduce el archivo CSV que se obtiene a partir de la{" "}
          <a href="https://docs.google.com/spreadsheets/d/1peL514fkHFE_xun6l_iAWW9msAXS3S08MuG6iUq8N2g/edit?usp=sharing">
            hoja de calculo
          </a>
          .
        </span>

        <div>
          <input ref={fileRef} type="file" name="filepdf" accept="text/csv" />
          <button onClick={onGenerarClick}>Generar</button>
        </div>
      </div>
    </div>
  );
}

export default App;
