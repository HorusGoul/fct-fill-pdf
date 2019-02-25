import React from "react";
import { downloadPage } from "../../download";

export function Pages({ pages, setPages }) {
  if (!pages.length) {
    return null;
  }

  const selectedCount = pages.filter(page => page.__meta.selected).length;
  const allSelected = selectedCount === pages.length;

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
            selected: !currentPage.__meta.selected
          }
        };
      })
    );
  }

  function toggleAllCheckboxes(event) {
    const newState = event.target.checked;

    setPages(pages =>
      pages.map(page => ({
        ...page,
        __meta: { ...page, selected: newState }
      }))
    );
  }

  function downloadPageClick(page) {
    downloadPage(page);
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
              <td>
                Hoja {index + 1} de {pages.length}
              </td>
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

      {selectedCount > 1 && (
        <button disabled className="button is-primary is-big">
          Descargar seleccionados
        </button>
      )}
    </div>
  );
}
