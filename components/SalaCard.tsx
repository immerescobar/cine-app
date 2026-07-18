"use client";

import type { Sala } from "@/types/asiento";

interface SalaCardProps {
  sala: Sala;
  onEditar: (sala: Sala) => void;
  onEliminar: (sala: Sala) => void;
}

// Equivalente de PeliculaCard.tsx, pero para salas. La logica de
// eliminar (con su validacion de "en uso") sigue viviendo en
// TablaSalas.tsx, aqui solo recibimos la funcion ya lista para usar.
export default function SalaCard({ sala, onEditar, onEliminar }: SalaCardProps) {
  return (
    <div className="sala-card">
      <div className="sala-card-header">
        <div>
          <p className="sala-card-titulo">{sala.nombre}</p>
          <span className="sala-card-codigo">{sala.id}</span>
        </div>
      </div>

      <div className="sala-card-datos">
        <div>
          <span className="label">Filas</span>
          <span className="valor">{sala.filas}</span>
        </div>
        <div>
          <span className="label">Columnas</span>
          <span className="valor">{sala.columnas}</span>
        </div>
        <div>
          <span className="label">Total</span>
          <span className="valor">{sala.filas * sala.columnas}</span>
        </div>
      </div>

      <div className="sala-card-acciones">
        <button className="btn btn-secondary btn-sm" onClick={() => onEditar(sala)}>
          Editar
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => onEliminar(sala)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}