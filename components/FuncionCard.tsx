"use client";

import type { Funcion } from "@/types/funcion";
import type { Pelicula } from "@/types/peliculas";
import type { Sala } from "@/types/asiento";

interface FuncionCardProps {
  funcion: Funcion;
  pelicula: Pelicula | undefined;
  sala: Sala | undefined;
  onEliminar: (funcionId: string) => void;
}

export default function FuncionCard({ funcion, pelicula, sala, onEliminar }: FuncionCardProps) {
  const disponibles = funcion.asientos.filter((a) => a.estado === "Disponible").length;

  return (
    <div className="funcion-card">
      <p className="funcion-card-titulo">{pelicula?.nombre ?? "Pelicula eliminada"}</p>
      <p className="funcion-card-detalle">
        {sala?.nombre ?? "Sala eliminada"} · {funcion.horario.replace("T", " ")}
      </p>
      <p className="funcion-card-disponibilidad">
        <strong>{disponibles}</strong> / {funcion.asientos.length} asientos disponibles
      </p>
      <div className="funcion-card-acciones">
        <button className="btn btn-danger btn-sm" onClick={() => onEliminar(funcion.id)}>
          Eliminar
        </button>
      </div>
    </div>
  );
}