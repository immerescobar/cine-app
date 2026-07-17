"use client";

import { useAppSelector } from "@/redux/hooks";
import { selectPeliculas } from "@/redux/slices/peliculaSlice";
import { selectSalas, selectFunciones } from "@/redux/slices/salasSlice";
import { selectReservas } from "@/redux/slices/reservasSlice";

export default function Dashboard() {
  const peliculas = useAppSelector(selectPeliculas);
  const salas = useAppSelector(selectSalas);
  const funciones = useAppSelector(selectFunciones);
  const reservas = useAppSelector(selectReservas);

  // --- Calculos derivados ---
  // Todos estos valores se recalculan en cada render, a partir del
  // estado real. No guardamos ningun "contador" aparte en Redux,
  // asi evitamos que un numero se desincronice de los datos reales.

  const totalPeliculas = peliculas.length;
  const totalFunciones = funciones.length;

  const totalBoletosVendidos = reservas.reduce(
    (suma, reserva) => suma + reserva.cantidadBoletos,
    0
  );

  const ingresosGenerados = reservas.reduce(
    (suma, reserva) => suma + reserva.total,
    0
  );

  // Sumamos los asientos de TODAS las funciones para tener el total
  // de la "capacidad" del cine, y cuantos de esos estan ocupados.
  const todosLosAsientos = funciones.flatMap((f) => f.asientos);
  const asientosOcupados = todosLosAsientos.filter(
    (a) => a.estado === "Reservado"
  ).length;
  const asientosDisponibles = todosLosAsientos.length - asientosOcupados;

  // Pelicula mas reservada: contamos cuantas reservas tiene cada
  // codigo de pelicula, y nos quedamos con el que tenga mas.
  function calcularPeliculaMasReservada(): string {
    if (reservas.length === 0) return "N/A";

    const conteos: Record<string, number> = {};
    for (const reserva of reservas) {
      conteos[reserva.peliculaCodigo] = (conteos[reserva.peliculaCodigo] ?? 0) + 1;
    }

    let codigoGanador = "";
    let maxReservas = 0;
    for (const [codigo, cantidad] of Object.entries(conteos)) {
      if (cantidad > maxReservas) {
        maxReservas = cantidad;
        codigoGanador = codigo;
      }
    }

    const pelicula = peliculas.find((p) => p.codigo === codigoGanador);
    return pelicula ? pelicula.nombre : "N/A";
  }

  const peliculaMasReservada = calcularPeliculaMasReservada();

  return (
    <div className="card">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="value">{totalPeliculas}</div>
          <div className="label">Peliculas</div>
        </div>

        <div className="stat-card">
          <div className="value">{salas.length}</div>
          <div className="label">Salas</div>
        </div>

        <div className="stat-card">
          <div className="value">{totalFunciones}</div>
          <div className="label">Funciones Programadas</div>
        </div>

        <div className="stat-card">
          <div className="value">{totalBoletosVendidos}</div>
          <div className="label">Boletos Vendidos</div>
        </div>

        <div className="stat-card">
          <div className="value">{asientosDisponibles}</div>
          <div className="label">Asientos Disponibles</div>
        </div>

        <div className="stat-card">
          <div className="value">{asientosOcupados}</div>
          <div className="label">Asientos Ocupados</div>
        </div>

        <div className="stat-card">
          <div className="value">${ingresosGenerados.toFixed(2)}</div>
          <div className="label">Ingresos Generados</div>
        </div>

        <div className="stat-card">
          <div className="value" style={{ fontSize: "1.1rem" }}>
            {peliculaMasReservada}
          </div>
          <div className="label">Pelicula Mas Reservada</div>
        </div>
      </div>
    </div>
  );
}