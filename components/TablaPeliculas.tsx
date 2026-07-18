"use client";

import { useState } from "react";
import type { Pelicula, GeneroPelicula, ClasificacionPelicula, EstadoPelicula } from "@/types/peliculas";
import { useAppSelector } from "@/redux/hooks";
import { selectPeliculas } from "@/redux/slices/peliculaSlice";
import { selectSalas } from "@/redux/slices/salasSlice";
import PeliculaFila from "./PeliculaFila";
import FormularioPelicula from "./FormularioPelicula";
import Buscador from "./Buscador";
import Filtros from "./Filtros";

export default function TablaPelicula() {
  const peliculas = useAppSelector(selectPeliculas);
  const salas = useAppSelector(selectSalas);

  const [peliculaEnEdicion, setPeliculaEnEdicion] = useState<Pelicula | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // --- Estado de busqueda y filtros ---
  // Todo esto es estado LOCAL (useState), no Redux: solo le importa
  // a esta pantalla, ningun otro componente necesita saber que estas
  // buscando "Fast" en este momento.
  const [busqueda, setBusqueda] = useState("");
  const [filtroGenero, setFiltroGenero] = useState<GeneroPelicula | "">("");
  const [filtroClasificacion, setFiltroClasificacion] = useState<ClasificacionPelicula | "">("");
  const [filtroSala, setFiltroSala] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<EstadoPelicula | "">("");

  // Termino de busqueda normalizado: sin espacios extremos y en minusculas,
  // para que la busqueda ignore mayusculas/minusculas y espacios sobrantes.
  const terminoBusqueda = busqueda.trim().toLowerCase();

  // Encadenamos varios .filter() seguidos: cada uno reduce un poco mas
  // la lista, empezando desde todas las peliculas. Esto se recalcula
  // en cada render, asi que siempre refleja el estado actual real.
  const peliculasFiltradas = peliculas
    .filter((p) => {
      // Busqueda dinamica por nombre, genero, clasificacion y sala.
      if (terminoBusqueda === "") return true;
      const sala = salas.find((s) => s.id === p.salaId);
      const textoBuscable = [
        p.nombre,
        p.genero,
        p.clasificacion,
        sala?.nombre ?? "",
        p.salaId,
      ]
        .join(" ")
        .toLowerCase();
      return textoBuscable.includes(terminoBusqueda);
    })
    .filter((p) => (filtroGenero === "" ? true : p.genero === filtroGenero))
    .filter((p) =>
      filtroClasificacion === "" ? true : p.clasificacion === filtroClasificacion
    )
    .filter((p) => (filtroSala === "" ? true : p.salaId === filtroSala))
    .filter((p) => (filtroEstado === "" ? true : p.estado === filtroEstado));

  function handleEditar(pelicula: Pelicula) {
    setPeliculaEnEdicion(pelicula);
    setMostrarFormulario(true);
  }

  function handleNuevaPelicula() {
    setPeliculaEnEdicion(null);
    setMostrarFormulario(true);
  }

  function handleCerrarFormulario() {
    setMostrarFormulario(false);
    setPeliculaEnEdicion(null);
  }

  function handleLimpiarFiltros() {
    setBusqueda("");
    setFiltroGenero("");
    setFiltroClasificacion("");
    setFiltroSala("");
    setFiltroEstado("");
  }

  return (
    <div className="card">
      <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h2>Peliculas</h2>
        <button className="btn btn-primary" onClick={handleNuevaPelicula}>
          + Nueva Pelicula
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioPelicula
          peliculaExistente={peliculaEnEdicion}
          onCerrar={handleCerrarFormulario}
        />
      )}

      {/* --- Barra de busqueda y filtros --- */}
      <div className="form-grid" style={{ marginTop: "var(--spacing-4)" }}>
        <Buscador valor={busqueda} onCambiar={setBusqueda} />
        <Filtros
          genero={filtroGenero}
          onGenero={setFiltroGenero}
          clasificacion={filtroClasificacion}
          onClasificacion={setFiltroClasificacion}
          sala={filtroSala}
          onSala={setFiltroSala}
          estado={filtroEstado}
          onEstado={setFiltroEstado}
          salas={salas}
        />
      </div>

      <div className="flex" style={{ justifyContent: "space-between", alignItems: "center", margin: "var(--spacing-3) 0" }}>
        <p className="text-muted" style={{ fontSize: "0.85rem", margin: 0 }}>
          Mostrando {peliculasFiltradas.length} de {peliculas.length} peliculas
        </p>
        <button className="btn btn-secondary btn-sm" onClick={handleLimpiarFiltros}>
          Limpiar filtros
        </button>
      </div>

      {peliculasFiltradas.length === 0 ? (
        <p className="empty-state">
          {peliculas.length === 0
            ? "No hay peliculas registradas todavia."
            : "Ninguna pelicula coincide con la busqueda/filtros."}
        </p>
      ) : (
        <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Genero</th>
              <th>Duracion</th>
              <th>Clasif.</th>
              <th>Sala</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {peliculasFiltradas.map((pelicula) => (
              <PeliculaFila
                key={pelicula.codigo}
                pelicula={pelicula}
                onEditar={handleEditar}
              />
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
}