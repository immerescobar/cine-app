"use client";

import type { Pelicula } from "@/types/peliculas";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { eliminarPelicula } from "@/redux/slices/peliculaSlice";
import { selectFunciones } from "@/redux/slices/salasSlice";

interface PeliculaCardProps {
  pelicula: Pelicula;
  onEditar: (pelicula: Pelicula) => void;
}

// Es el equivalente de PeliculaFila.tsx, pero para la vista de tarjetas
// en movil. Recibe las mismas props y usa la misma logica de eliminar,
// solo cambia el formato visual (tarjeta apilada, no fila de tabla).
export default function PeliculaCard({ pelicula, onEditar }: PeliculaCardProps) {
  const dispatch = useAppDispatch();
  const funciones = useAppSelector(selectFunciones);

  function handleEliminar() {
    // Evitamos eliminar una pelicula que todavia esta en uso por una funcion
    // programada, para no dejar funciones "huerfanas" apuntando a una
    // pelicula inexistente (mismo criterio que TablaSalas.tsx).
    const enUsoPorFuncion = funciones.some((f) => f.peliculaCodigo === pelicula.codigo);
    if (enUsoPorFuncion) {
      alert(
        `No se puede eliminar "${pelicula.nombre}" porque esta en uso por al menos una funcion programada.`
      );
      return;
    }

    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar "${pelicula.nombre}"?`
    );
    if (confirmar) {
      dispatch(eliminarPelicula(pelicula.codigo));
    }
  }

  return (
    <div className="pelicula-card">
      <div className="pelicula-card-header">
        <div>
          <p className="pelicula-card-titulo">{pelicula.nombre}</p>
          <span className="pelicula-card-codigo">{pelicula.codigo}</span>
        </div>
        <span
          className={`badge ${
            pelicula.estado === "Disponible" ? "badge-success" : "badge-danger"
          }`}
        >
          {pelicula.estado}
        </span>
      </div>

      <div className="pelicula-card-datos">
        <div className="pelicula-card-dato">
          <span className="label">Genero</span>
          <span className="badge badge-neutral">{pelicula.genero}</span>
        </div>
        <div className="pelicula-card-dato">
          <span className="label">Duracion</span>
          {pelicula.duracionMinutos} min
        </div>
        <div className="pelicula-card-dato">
          <span className="label">Clasificacion</span>
          <span className="badge badge-accent">{pelicula.clasificacion}</span>
        </div>
        <div className="pelicula-card-dato">
          <span className="label">Sala</span>
          <span className="badge badge-neutral">{pelicula.salaId}</span>
        </div>
        <div className="pelicula-card-dato">
          <span className="label">Precio</span>${pelicula.precio.toFixed(2)}
        </div>
      </div>

      <div className="pelicula-card-acciones">
        <button className="btn btn-secondary btn-sm" onClick={() => onEditar(pelicula)}>
          Editar
        </button>
        <button className="btn btn-danger btn-sm" onClick={handleEliminar}>
          Eliminar
        </button>
      </div>
    </div>
  );
}