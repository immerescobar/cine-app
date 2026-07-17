"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectPeliculas } from "@/redux/slices/peliculaSlice";
import {
    selectFunciones,
    selectSalas,
    reservarAsientos,
} from "@/redux/slices/salasSlice";
import { agregarReserva } from "@/redux/slices/reservasSlice";
import MapaAsientos from "./MapaAsientos";

export default function FormularioReserva() {
    const dispatch = useAppDispatch();
    const peliculas = useAppSelector(selectPeliculas);
    const funciones = useAppSelector(selectFunciones);
    const salas = useAppSelector(selectSalas);

    const [peliculaCodigo, setPeliculaCodigo] = useState("");
    const [funcionId, setFuncionId] = useState("");
    const [asientosSeleccionado, setAsientosSeleccionados] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");

    //Solo mostramos peliculas disponibles para reservar
    const peliculasDisponibles = peliculas.filter((p) => p.estado === "Disponible");

    //Solo las funciones que pertenecen a la pelicula seleccionada
    const funcionesDeLaPelicula = funciones.filter(
        (f) => f.peliculaCodigo === peliculaCodigo
    );

    const funcionSeleccionada = funciones.find((f) => f.id === funcionId);
    const peliculaSeleccionada = peliculas.find((p) => p.codigo === peliculaCodigo);

    const total = peliculaSeleccionada
        ? peliculaSeleccionada.precio * asientosSeleccionado.length
        : 0;

    function handleCambiarPelicula(codigo: string) {
        setPeliculaCodigo(codigo);
        setFuncionId(""); // al cambiar de pelicula, se resetea la funcion elegida
        setAsientosSeleccionados([]);
        setMensajeExito("");
    }

    function handleCambiarFuncion(id: string) {
        setFuncionId(id);
        setAsientosSeleccionados([]); //Al cambiar de funcion, se resetean los asientos
        setMensajeExito("");
    }

    function handleToggleAsiento(asientoId: string) {
        setAsientosSeleccionados((prev) =>
            prev.includes(asientoId)
                ? prev.filter((id) => id !== asientoId) //Ya estaba, lo quitamos
                : [...prev, asientoId] //No estaba, lo agregamos
        );
    }

    function handleConfirmar() {
        setError("");

        if (!peliculaCodigo) {
            setError("Selecciona una pelicula.");
            return;
        }
        if (!funcionId) {
            setError("Selecciona una funcion.");
            return;
        }
        if (asientosSeleccionado.length === 0) {
            setError("Selecciona al menos un asiento.");
            return;
        }

        dispatch(reservarAsientos({ funcionId, asientosIds: asientosSeleccionado }));

        dispatch(
            agregarReserva({
                id: `R${Date.now()}`,
                funcionId,
                peliculaCodigo,
                asientosIds: asientosSeleccionado,
                cantidadBoletos: asientosSeleccionado.length,
                total,
                fechaHora: new Date().toISOString(),
            })
        );

        setMensajeExito(
            `Reserva confirmada: ${asientosSeleccionado.length} boleto(s) por $${total.toFixed(2)}.`
        );
        setPeliculaCodigo("");
        setFuncionId("");
        setAsientosSeleccionados([]);
    }

    return (
        <div className="card">
            <h2>Reservar Boletos</h2>

            <div className="form-grid">
                <div className="form-field">
                    <label>Pelicula</label>
                    <select
                        value={peliculaCodigo}
                        onChange={(e) => handleCambiarPelicula(e.target.value)}
                    >
                        <option value="">-- Selecciona una pelicula --</option>
                        {peliculasDisponibles.map((p) => (
                            <option key={p.codigo} value={p.codigo}>
                                {p.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                {peliculaCodigo && (
                    <div className="form-field">
                        <label>Funcion</label>
                        <select
                            value={funcionId}
                            onChange={(e) => handleCambiarFuncion(e.target.value)}
                        >
                            <option value="">-- Selecciona una funcion --</option>
                            {funcionesDeLaPelicula.map((f) => {
                                const sala = salas.find((s) => s.id === f.salaId);
                                return (
                                    <option key={f.id} value={f.id}>
                                        {sala?.nombre} - {f.horario}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                )}
            </div>

            {funcionSeleccionada && (
                <MapaAsientos
                asientos={funcionSeleccionada.asientos}
                asientosSeleccionados={asientosSeleccionado}
                onToggleAsiento={handleToggleAsiento}
                />
            )}

            {funcionSeleccionada && (
                <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                <p>
                    Asientos: <strong>{asientosSeleccionado.length}</strong> &nbsp;|&nbsp;
                    Total: <strong>${total.toFixed(2)}</strong>
                </p>
                <button className="btn btn-primary" onClick={handleConfirmar}>
                    Confirmar Reserva
                </button>
                </div>
            )}

            {error && <p className="field-error">{error}</p>}
            {mensajeExito && <p style={{color: "var(--color-success)" }}>{mensajeExito}</p>}
        </div>
    );
}