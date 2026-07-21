"use client";

import { useState } from "react";
import Dashboard from "@/components/Dashboard";
import TablaPelicula from "@/components/TablaPeliculas";
import TablaSalas from "@/components/TablaSalas";
import FormularioFuncion from "@/components/FormularioFuncion";
import FormularioReserva from "@/components/FormularioReserva";

export type Modulo = "dashboard" | "peliculas" | "salas" | "funciones" | "reservas";

export default function Home() {
  const [moduloActivo, setModuloActivo] = useState<Modulo>("peliculas");

  return (
    //Fragmento React Fragment nos deja agrupar header y main
    //como hermanos, sin tener que envolcerlos en un div extra
    //que no aporta nada al HTML final
    <>
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <span className="app-logo" aria-hidden="true">🎬</span>
            <h1>
              Cine-filo Sin Plata
              <span className="tagline">Sistema de venta de entradas</span>
            </h1>
          </div>
          <nav className="nav-tabs">
            <button
              className={moduloActivo === "dashboard" ? "active" : ""}
              onClick={() => setModuloActivo("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={moduloActivo === "peliculas" ? "active" : ""}
              onClick={() => setModuloActivo("peliculas")}
            >
              Peliculas
            </button>
            <button
              className={moduloActivo === "salas" ? "active" : ""}
              onClick={() => setModuloActivo("salas")}
            >
              Salas
            </button>
            <button
              className={moduloActivo === "funciones" ? "active" : ""}
              onClick={() => setModuloActivo("funciones")}
            >
              Funciones
            </button>
            <button
              className={moduloActivo === "reservas" ? "active" : ""}
              onClick={() => setModuloActivo("reservas")}
            >
              Reservar Boletos
            </button>
          </nav>
        </div>
      </header>
      <main className="container">
        {moduloActivo === "dashboard" && <Dashboard onNavigate={setModuloActivo} />}
        {moduloActivo === "peliculas" && <TablaPelicula />}
        {moduloActivo === "salas" && <TablaSalas />}
        {moduloActivo === "funciones" && <FormularioFuncion />}
        {moduloActivo === "reservas" && <FormularioReserva />}
      </main>
    </>
  );
} 