import React from "react";
import { downloadPage, downloadMultiplePages } from "../../download";

export function Pages({ pages, setPages }) {
  if (!pages.length) {
    return null;
  }

  const selectedPages = pages.filter(page => page.__meta.selected);
  const allSelected = selectedPages.length === pages.length;

  function toggleCheck(page) {
    setPages(pages =>
      pages.map(currentPage => {
        if (currentPage !== page) {
          return currentPage;
        }

        return {
          ...currentPage,
          __meta: {
            ...currentPage.__meta,
            selected: !currentPage.__meta.selected,
          },
        };
      })
    );
  }

  function toggleAllCheckboxes(event) {
    const newState = event.target.checked;

    setPages(pages =>
      pages.map(page => ({
        ...page,
        __meta: { ...page.__meta, selected: newState },
      }))
    );
  }

  function downloadPageClick(page) {
    downloadPage(page);
  }

  function downloadSelectedClick() {
    downloadMultiplePages(selectedPages);
  }

  return (
    <div className="field">
      <span className="label">
        2. Selecciona los documentos que quieres descargar o descargalos
        individualmente
      </span>

      <table className="table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAllCheckboxes}
              />
            </th>
            <th>Nº Hoja</th>
            <th>Nombre</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {pages.map((page, index) => (
            <tr key={index}>
              <td>
                <input
                  type="checkbox"
                  checked={page.__meta.selected}
                  onChange={e => toggleCheck(page)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{page.__meta.fileName}</td>
              <td>
                <button
                  onClick={e => downloadPageClick(page)}
                  className="button is-small is-outlined is-primary"
                >
                  Descargar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={downloadSelectedClick}
        disabled={selectedPages.length === 0}
        className="button is-primary is-medium"
      >
        Descargar seleccionados
      </button>
    </div>
  );
}
