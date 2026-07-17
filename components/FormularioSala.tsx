"use client";

import { useState } from "react";
import type { Sala } from "@/types/asiento";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { agregarSala, editarSala, selectSalas } from "@/redux/slices/salasSlice";

interface FormularioSalaProps {
  salaExistente: Sala | null;
  onCerrar: () => void;
}

export default function FormularioSala({ salaExistente, onCerrar }: FormularioSalaProps) {
  const dispatch = useAppDispatch();
  const salas = useAppSelector(selectSalas);

  const esEdicion = salaExistente !== null;

  const [id, setId] = useState(salaExistente?.id ?? "");
  const [nombre, setNombre] = useState(salaExistente?.nombre ?? "");
  const [filas, setFilas] = useState(salaExistente?.filas ?? 5);
  const [columnas, setColumnas] = useState(salaExistente?.columnas ?? 8);
  const [errores, setErrores] = useState<Record<string, string>>({});

  function validar(): boolean {
    const nuevosErrores: Record<string, string> = {};

    if (id.trim() === "") {
      nuevosErrores.id = "El codigo de sala es obligatorio.";
    } else if (!esEdicion && salas.some((s) => s.id.toLowerCase() === id.trim().toLowerCase())) {
      nuevosErrores.id = "Ya existe una sala con este codigo.";
    }

    if (nombre.trim() === "") {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (filas <= 0) {
      nuevosErrores.filas = "Debe haber al menos 1 fila.";
    }

    if (columnas <= 0) {
      nuevosErrores.columnas = "Debe haber al menos 1 columna.";
    }

    if (filas * columnas > 200) {
      nuevosErrores.columnas = "El total de asientos no puede superar 200.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validar()) return;

    const salaData: Sala = { id: id.trim(), nombre: nombre.trim(), filas, columnas };

    if (esEdicion) {
      dispatch(editarSala(salaData));
    } else {
      dispatch(agregarSala(salaData));
    }

    onCerrar();
  }

  return (
    <div className="card" style={{ background: "var(--color-bg-soft)" }}>
      <h2>{esEdicion ? "Editar Sala" : "Nueva Sala"}</h2>

      {esEdicion && (
        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
          Nota: cambiar filas/columnas solo afecta a las funciones que se
          programen despues. Las funciones ya existentes conservan su
          mapa de asientos original.
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className={`form-field ${errores.id ? "has-error" : ""}`}>
            <label>Codigo (ej. S3)</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={esEdicion}
            />
            {errores.id && <span className="field-error">{errores.id}</span>}
          </div>

          <div className={`form-field ${errores.nombre ? "has-error" : ""}`}>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errores.nombre && <span className="field-error">{errores.nombre}</span>}
          </div>

          <div className={`form-field ${errores.filas ? "has-error" : ""}`}>
            <label>Filas</label>
            <input
              type="number"
              value={filas}
              onChange={(e) => setFilas(Number(e.target.value))}
            />
            {errores.filas && <span className="field-error">{errores.filas}</span>}
          </div>

          <div className={`form-field ${errores.columnas ? "has-error" : ""}`}>
            <label>Columnas (asientos por fila)</label>
            <input
              type="number"
              value={columnas}
              onChange={(e) => setColumnas(Number(e.target.value))}
            />
            {errores.columnas && <span className="field-error">{errores.columnas}</span>}
          </div>
        </div>

        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
          Total de asientos: {filas * columnas}
        </p>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {esEdicion ? "Guardar cambios" : "Agregar sala"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCerrar}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}