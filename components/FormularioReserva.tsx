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
    const [salaId, setSalaId] = useState("");
    const [funcionId, setFuncionId] = useState("");
    const [cantidadBoletos, setCantidadBoletos] = useState(1);
    const [asientosSeleccionado, setAsientosSeleccionados] = useState<string[]>([]);
    const [error, setError] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");

    //Solo mostramos peliculas disponibles para reservar
    const peliculasDisponibles = peliculas.filter((p) => p.estado === "Disponible");

    //Funciones que pertenecen a la pelicula seleccionada
    const funcionesDeLaPelicula = funciones.filter(
        (f) => f.peliculaCodigo === peliculaCodigo
    );

    // Solo las salas que tienen al menos una funcion para esa pelicula.
    const salasConFunciones = salas.filter((s) =>
        funcionesDeLaPelicula.some((f) => f.salaId === s.id)
    );

    // Funciones de la pelicula EN la sala elegida.
    const funcionesDeSala = funcionesDeLaPelicula.filter((f) => f.salaId === salaId);

    const funcionSeleccionada = funciones.find((f) => f.id === funcionId);
    const peliculaSeleccionada = peliculas.find((p) => p.codigo === peliculaCodigo);

    // El total se calcula con la cantidad de boletos indicada y el precio.
    const total = peliculaSeleccionada
        ? peliculaSeleccionada.precio * cantidadBoletos
        : 0;

    function handleCambiarPelicula(codigo: string) {
        // Al cambiar de pelicula se limpian sala, funcion y asientos.
        setPeliculaCodigo(codigo);
        setSalaId("");
        setFuncionId("");
        setAsientosSeleccionados([]);
        setError("");
        setMensajeExito("");
    }

    function handleCambiarSala(id: string) {
        // Al cambiar de sala se limpian funcion y asientos.
        setSalaId(id);
        setFuncionId("");
        setAsientosSeleccionados([]);
        setError("");
        setMensajeExito("");
    }

    function handleCambiarFuncion(id: string) {
        setFuncionId(id);
        setAsientosSeleccionados([]); //Al cambiar de funcion, se resetean los asientos
        setError("");
        setMensajeExito("");
    }

    function handleCambiarCantidad(valor: number) {
        // La cantidad debe ser un entero >= 1. Al cambiarla se limpia la
        // seleccion para que el usuario elija exactamente esa cantidad.
        const cantidad = Number.isNaN(valor) ? 1 : Math.max(1, Math.floor(valor));
        setCantidadBoletos(cantidad);
        setAsientosSeleccionados([]);
        setError("");
        setMensajeExito("");
    }

    function handleToggleAsiento(asientoId: string) {
        const yaSeleccionado = asientosSeleccionado.includes(asientoId);
        // No se pueden seleccionar mas asientos que la cantidad de boletos.
        if (!yaSeleccionado && asientosSeleccionado.length >= cantidadBoletos) {
            setError(
                `Solo puedes seleccionar ${cantidadBoletos} asiento(s) segun la cantidad de boletos.`
            );
            return;
        }
        setError("");
        setAsientosSeleccionados((prev) =>
            yaSeleccionado
                ? prev.filter((id) => id !== asientoId) //Ya estaba, lo quitamos
                : [...prev, asientoId] //No estaba, lo agregamos
        );
    }

    function handleConfirmar() {
        setError("");

        // El boton "Confirmar" solo se renderiza cuando ya hay una funcion
        // seleccionada (mas abajo), por lo que peliculaCodigo, salaId y
        // funcionId siempre existen aqui: no hace falta revalidarlos.
        if (cantidadBoletos <= 0) {
            setError("La cantidad de boletos debe ser mayor que cero.");
            return;
        }

        // El usuario debe seleccionar EXACTAMENTE la cantidad de boletos:
        // ni mas ni menos.
        if (asientosSeleccionado.length !== cantidadBoletos) {
            setError(
                `Debes seleccionar exactamente ${cantidadBoletos} asiento(s). Seleccionaste ${asientosSeleccionado.length}.`
            );
            return;
        }

        // Verificacion de disponibilidad antes de reservar: si algun asiento
        // elegido ya fue ocupado, no se completa la operacion ni se registra
        // la venta. Es coherente con la guarda atomica del reducer.
        const hayOcupados = asientosSeleccionado.some((id) => {
            const asiento = funcionSeleccionada?.asientos.find((a) => a.id === id);
            return !asiento || asiento.estado !== "Disponible";
        });
        if (hayOcupados) {
            setError(
                "No se pudo completar la reserva: uno o mas asientos ya fueron reservados. Actualiza tu seleccion."
            );
            setAsientosSeleccionados([]);
            return;
        }

        dispatch(reservarAsientos({ funcionId, asientosIds: asientosSeleccionado }));

        dispatch(
            agregarReserva({
                id: `R${Date.now()}`,
                funcionId,
                peliculaCodigo,
                asientosIds: asientosSeleccionado,
                cantidadBoletos,
                total,
                fechaHora: new Date().toISOString(),
            })
        );

        setMensajeExito(
            `Reserva confirmada: ${cantidadBoletos} boleto(s) por $${total.toFixed(2)}.`
        );
        setPeliculaCodigo("");
        setSalaId("");
        setFuncionId("");
        setCantidadBoletos(1);
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
                        <label>Sala</label>
                        <select
                            value={salaId}
                            onChange={(e) => handleCambiarSala(e.target.value)}
                        >
                            <option value="">-- Selecciona una sala --</option>
                            {salasConFunciones.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {peliculaCodigo && salaId && (
                    <div className="form-field">
                        <label>Funcion</label>
                        <select
                            value={funcionId}
                            onChange={(e) => handleCambiarFuncion(e.target.value)}
                        >
                            <option value="">-- Selecciona una funcion --</option>
                            {funcionesDeSala.map((f) => (
                                <option key={f.id} value={f.id}>
                                    {f.horario}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {funcionSeleccionada && (
                    <div className="form-field">
                        <label>Cantidad de boletos</label>
                        <input
                            type="number"
                            min={1}
                            step={1}
                            value={cantidadBoletos}
                            onChange={(e) => handleCambiarCantidad(Number(e.target.value))}
                        />
                    </div>
                )}
            </div>

            {peliculaCodigo && salasConFunciones.length === 0 && (
                <p className="empty-state">
                    No hay funciones disponibles para esta película
                </p>
            )}

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
                    Boletos: <strong>{cantidadBoletos}</strong> &nbsp;|&nbsp;
                    Asientos elegidos: <strong>{asientosSeleccionado.length}</strong> &nbsp;|&nbsp;
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
