"use client";

import type { Pelicula } from "@/types/peliculas";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { eliminarPelicula } from "@/redux/slices/peliculaSlice";
import { selectFunciones } from "@/redux/slices/salasSlice";

interface PeliculaFilaProps {
  pelicula: Pelicula;
  onEditar: (pelicula: Pelicula) => void;
}

export default function PeliculaFila({ pelicula, onEditar }: PeliculaFilaProps) {
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
    <tr>
      <td>{pelicula.codigo}</td>
      <td>{pelicula.nombre}</td>
      <td>
        <span className="badge badge-neutral">{pelicula.genero}</span>
      </td>
      <td>{pelicula.duracionMinutos} min</td>
      <td>
        <span className="badge badge-accent">{pelicula.clasificacion}</span>
      </td>
      <td>
        <span className="badge badge-neutral">{pelicula.salaId}</span>
      </td>
      <td>${pelicula.precio.toFixed(2)}</td>
      <td>
        <span
          className={`badge ${
            pelicula.estado === "Disponible" ? "badge-success" : "badge-danger"
          }`}
        >
          {pelicula.estado}
        </span>
      </td>
      <td>
        <div className="table-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onEditar(pelicula)}>
            Editar
          </button>
          <button className="btn btn-danger btn-sm" onClick={handleEliminar}>
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}