"use client";

import { useState } from "react";
import type { Pelicula, GeneroPelicula, ClasificacionPelicula, EstadoPelicula } from "@/types/peliculas";
import { useAppSelector } from "@/redux/hooks";
import { selectPeliculas } from "@/redux/slices/peliculaSlice";
import { selectSalas } from "@/redux/slices/salasSlice";
import PeliculaFila from "./PeliculaFila";
import PeliculaCard from "./PeliculaCard";
import FormularioPelicula from "./FormularioPelicula";
import Buscador from "./Buscador";
import Filtros from "./Filtros";

export default function TablaPelicula() {
  const peliculas = useAppSelector(selectPeliculas);
  const salas = useAppSelector(selectSalas);

  const [peliculaEnEdicion, setPeliculaEnEdicion] = useState<Pelicula | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

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

    const filtrosActivos = [
      busqueda.trim() !== "",
      filtroGenero !== "",
      filtroClasificacion !== "",
      filtroSala !== "",
      filtroEstado !== "",
    ].filter(Boolean).length;

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
    setMostrarFiltros(false);
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
      <div style={{ marginTop: "var(--spacing-4)" }}>
        <div className="search-row">
          <Buscador valor={busqueda} onCambiar={setBusqueda} />
        </div>

        <button
          type="button"
          className="filters-toggle"
          onClick={() => setMostrarFiltros((prev) => !prev)}
        >
          <span>
            Filtros {filtrosActivos > 0 && <span className="filters-count">{filtrosActivos}</span>}
          </span>
          <span className={`filters-chevron ${mostrarFiltros ? "open" : ""}`}>▾</span>
        </button>

        {mostrarFiltros && (
          <div className="filters-grid">
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
        )}
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
        <>
          {/* Vista de tarjetas: visible en movil, oculta en tablet+ (ver CSS) */}
          <div className="pelicula-cards">
            {peliculasFiltradas.map((pelicula) => (
              <PeliculaCard
                key={pelicula.codigo}
                pelicula={pelicula}
                onEditar={handleEditar}
              />
            ))}
          </div>

          {/* Vista de tabla: oculta en movil, visible en tablet+ (ver CSS) */}
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
        </>
      )}
    </div>
  );
}