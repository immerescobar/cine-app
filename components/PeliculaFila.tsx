"use client";

import type { Pelicula } from "@/types/peliculas";
import { useAppDispatch } from "@/redux/hooks";
import { eliminarPelicula } from "@/redux/slices/peliculaSlice";

interface PeliculaFilaProps {
  pelicula: Pelicula;
  onEditar: (pelicula: Pelicula) => void;
}

export default function PeliculaFila({ pelicula, onEditar }: PeliculaFilaProps) {
  const dispatch = useAppDispatch();

  function handleEliminar() {
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
      <td>{pelicula.genero}</td>
      <td>{pelicula.duracionMinutos} min</td>
      <td>{pelicula.clasificacion}</td>
      <td>{pelicula.salaId}</td>
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