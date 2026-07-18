"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectPeliculas } from "@/redux/slices/peliculaSlice";
import { selectSalas, selectFunciones, agregarFuncion, eliminarFuncion } from "@/redux/slices/salasSlice";
import FuncionCard from "./FuncionCard";

export default function FormularioFuncion() {
  const dispatch = useAppDispatch();
  const peliculas = useAppSelector(selectPeliculas);
  const salas = useAppSelector(selectSalas);
  const funciones = useAppSelector(selectFunciones);

  // Solo se pueden programar funciones para peliculas Disponibles (B3).
  // La lista completa `peliculas` se sigue usando abajo para mostrar el
  // nombre de las funciones historicas, aunque su pelicula ya no lo este.
  const peliculasDisponibles = peliculas.filter((p) => p.estado === "Disponible");

  const [peliculaCodigo, setPeliculaCodigo] = useState("");
  function handleCambiarPelicula(codigo: string) {
        setPeliculaCodigo(codigo);
        // Pre-seleccionamos la sala asignada de la pelicula, pero el usuario
        // puede cambiarla despues si quiere programar la funcion en otra sala.
        const pelicula = peliculas.find((p) => p.codigo === codigo);
        if (pelicula) {
            setSalaId(pelicula.salaId);
        }
    }

  const [salaId, setSalaId] = useState("");
  const [horario, setHorario] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!peliculaCodigo) {
      setError("Selecciona una pelicula.");
      return;
    }
    if (!salaId) {
      setError("Selecciona una sala.");
      return;
    }
    if (!horario) {
      setError("Selecciona un horario.");
      return;
    }

    // Validacion clave del PDF: no permitir horarios repetidos en la misma sala.
    const yaExiste = funciones.some(
      (f) => f.salaId === salaId && f.horario === horario
    );
    if (yaExiste) {
      setError("Ya existe una funcion en esa sala a ese horario.");
      return;
    }

    // La pelicula debe seguir disponible al momento de crear la funcion (B3).
    const pelicula = peliculas.find((p) => p.codigo === peliculaCodigo);
    if (!pelicula || pelicula.estado !== "Disponible") {
      setError("La pelicula seleccionada no esta disponible.");
      return;
    }

    dispatch(
      agregarFuncion({
        peliculaCodigo,
        salaId,
        horario,
        peliculaDisponible: pelicula.estado === "Disponible",
      })
    );
    setPeliculaCodigo("");
    setSalaId("");
    setHorario("");
  }

  function handleEliminar(funcionId: string) {
    const confirmar = window.confirm("Seguro que deseas eliminar esta funcion?");
    if (confirmar) {
      dispatch(eliminarFuncion(funcionId));
    }
  }

  return (
    <div className="card">
      <h2>Programar Funciones</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field">
            <label>Pelicula</label>
            <select value={peliculaCodigo} onChange={(e) => handleCambiarPelicula(e.target.value)}>
              <option value="">-- Selecciona --</option>
              {peliculasDisponibles.map((p) => (
                <option key={p.codigo} value={p.codigo}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Sala</label>
            <select value={salaId} onChange={(e) => setSalaId(e.target.value)}>
              <option value="">-- Selecciona --</option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre} ({s.filas * s.columnas} asientos)
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Horario</label>
            <input
              type="datetime-local"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="field-error">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Programar Funcion
          </button>
        </div>
      </form>

      <h2 style={{ marginTop: "var(--spacing-6)" }}>Funciones Programadas</h2>
      {funciones.length === 0 ? (
        <p className="empty-state">No hay funciones programadas todavia.</p>
      ) : (
        <>
          <div className="funcion-cards">
            {funciones.map((f) => (
              <FuncionCard
                key={f.id}
                funcion={f}
                pelicula={peliculas.find((p) => p.codigo === f.peliculaCodigo)}
                sala={salas.find((s) => s.id === f.salaId)}
                onEliminar={handleEliminar}
              />
            ))}
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pelicula</th>
                  <th>Sala</th>
                  <th>Horario</th>
                  <th>Asientos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {funciones.map((f) => {
                  const pelicula = peliculas.find((p) => p.codigo === f.peliculaCodigo);
                  const sala = salas.find((s) => s.id === f.salaId);
                  const disponibles = f.asientos.filter((a) => a.estado === "Disponible").length;

                  return (
                    <tr key={f.id}>
                      <td>{pelicula?.nombre ?? "Pelicula eliminada"}</td>
                      <td>{sala?.nombre ?? "Sala eliminada"}</td>
                      <td>{f.horario.replace("T", " ")}</td>
                      <td>
                        {disponibles} / {f.asientos.length} disponibles
                      </td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(f.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}