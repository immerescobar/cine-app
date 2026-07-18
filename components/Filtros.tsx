"use client";

import type {
  GeneroPelicula,
  ClasificacionPelicula,
  EstadoPelicula,
} from "@/types/peliculas";
import type { Sala } from "@/types/asiento";

// Componente de presentacion: agrupa los cuatro filtros desplegables
// (genero, clasificacion, sala y estado). Recibe los valores y los setters
// desde TablaPeliculas; no guarda estado propio ni conoce la lista de
// peliculas, para no duplicar la logica de filtrado.
interface FiltrosProps {
  genero: GeneroPelicula | "";
  onGenero: (valor: GeneroPelicula | "") => void;
  clasificacion: ClasificacionPelicula | "";
  onClasificacion: (valor: ClasificacionPelicula | "") => void;
  sala: string;
  onSala: (valor: string) => void;
  estado: EstadoPelicula | "";
  onEstado: (valor: EstadoPelicula | "") => void;
  salas: Sala[];
}

const GENEROS: GeneroPelicula[] = [
  "Accion",
  "Comedia",
  "Drama",
  "Terror",
  "Ciencia Ficcion",
  "Animacion",
  "Romance",
  "Suspenso",
];

const CLASIFICACIONES: ClasificacionPelicula[] = ["A", "B", "C"];

export default function Filtros({
  genero,
  onGenero,
  clasificacion,
  onClasificacion,
  sala,
  onSala,
  estado,
  onEstado,
  salas,
}: FiltrosProps) {
  return (
    <>
      <div className="form-field">
        <label>Genero</label>
        <select value={genero} onChange={(e) => onGenero(e.target.value as GeneroPelicula | "")}>
          <option value="">Todos</option>
          {GENEROS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Clasificacion</label>
        <select
          value={clasificacion}
          onChange={(e) => onClasificacion(e.target.value as ClasificacionPelicula | "")}
        >
          <option value="">Todas</option>
          {CLASIFICACIONES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Sala</label>
        <select value={sala} onChange={(e) => onSala(e.target.value)}>
          <option value="">Todas</option>
          {salas.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label>Estado</label>
        <select value={estado} onChange={(e) => onEstado(e.target.value as EstadoPelicula | "")}>
          <option value="">Todos</option>
          <option value="Disponible">Disponible</option>
          <option value="No disponible">No disponible</option>
        </select>
      </div>
    </>
  );
}
