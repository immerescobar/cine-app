"use client";

import { useState } from "react";
import type { Sala } from "@/types/asiento";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectSalas, eliminarSala } from "@/redux/slices/salasSlice";
import { selectPeliculas } from "@/redux/slices/peliculaSlice";
import { selectFunciones } from "@/redux/slices/salasSlice";
import FormularioSala from "./FormularioSala";
import SalaCard from "./SalaCard";

export default function TablaSalas() {
  const dispatch = useAppDispatch();
  const salas = useAppSelector(selectSalas);
  const peliculas = useAppSelector(selectPeliculas);
  const funciones = useAppSelector(selectFunciones);

  const [salaEnEdicion, setSalaEnEdicion] = useState<Sala | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  function handleNuevaSala() {
    setSalaEnEdicion(null);
    setMostrarFormulario(true);
  }

  function handleEditar(sala: Sala) {
    setSalaEnEdicion(sala);
    setMostrarFormulario(true);
  }

  function handleCerrarFormulario() {
    setMostrarFormulario(false);
    setSalaEnEdicion(null);
  }

  function handleEliminar(sala: Sala) {
    // Evitamos eliminar una sala que todavia esta en uso, para no dejar
    // peliculas o funciones "huerfanas" apuntando a una sala inexistente.
    const enUsoPorPelicula = peliculas.some((p) => p.salaId === sala.id);
    const enUsoPorFuncion = funciones.some((f) => f.salaId === sala.id);

    if (enUsoPorPelicula || enUsoPorFuncion) {
      alert(
        `No se puede eliminar "${sala.nombre}" porque esta en uso por al menos una pelicula o funcion.`
      );
      return;
    }

    const confirmar = window.confirm(`Seguro que deseas eliminar "${sala.nombre}"?`);
    if (confirmar) {
      dispatch(eliminarSala(sala.id));
    }
  }

  return (
    <div className="card">
      <div className="section-header">
        <div>
          <h2>Salas</h2>
          <p>Administra las salas del cine: filas, columnas y capacidad total de cada una.</p>
        </div>
        <button className="btn btn-primary" onClick={handleNuevaSala}>
          + Nueva Sala
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioSala salaExistente={salaEnEdicion} onCerrar={handleCerrarFormulario} />
      )}

      {salas.length === 0 ? (
        <p className="empty-state">No hay salas registradas todavia.</p>
      ) : (
        <>
          <div className="sala-cards">
            {salas.map((sala) => (
              <SalaCard
                key={sala.id}
                sala={sala}
                onEditar={handleEditar}
                onEliminar={handleEliminar}
              />
            ))}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Nombre</th>
                  <th>Filas</th>
                  <th>Columnas</th>
                  <th>Total Asientos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {salas.map((sala) => (
                  <tr key={sala.id}>
                    <td>{sala.id}</td>
                    <td>{sala.nombre}</td>
                    <td>{sala.filas}</td>
                    <td>{sala.columnas}</td>
                    <td>
                      <span className="badge badge-accent">{sala.filas * sala.columnas}</span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEditar(sala)}>
                          Editar
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(sala)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}