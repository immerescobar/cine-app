"use client";

import React, { useState } from "react";
import type { Pelicula, GeneroPelicula, ClasificacionPelicula } from "@/types/peliculas";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { agregarPelicula, actualizarPelicula, selectPeliculas } from "@/redux/slices/peliculaSlice";
import { selectSalas } from "@/redux/slices/salasSlice";

interface FormularioPeliculaProps {
    peliculaExistente: Pelicula | null;
    onCerrar: () => void;
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

export default function FormularioPelicula({
    peliculaExistente,
    onCerrar,
}: FormularioPeliculaProps) {
    const dispatch = useAppDispatch();
    const peliculas = useAppSelector(selectPeliculas);
    const salas = useAppSelector(selectSalas);

    const esEdicion = peliculaExistente !== null;

    // Estado local del formulario. Si es edicion, arranca con los datos
    // de la pelicula existente; si es creacion, arranca con valores vacios.
    const [codigo, setCodigo] = useState(peliculaExistente?.codigo ?? "");
    const [nombre, setNombre] = useState(peliculaExistente?.nombre ?? "");
    const [genero, setGenero] = useState<GeneroPelicula>(peliculaExistente?.genero ?? "Accion");
    const [duracionMinutos, setDuracionMinutos] = useState(peliculaExistente?.duracionMinutos ?? 90);
    const [clasificacion, setClasificacion] = useState<ClasificacionPelicula>(peliculaExistente?.clasificacion ?? "A");
    const [salaId, setSalaId] = useState(peliculaExistente?.salaId ?? salas[0]?.id ?? "");
    const [precio, setPrecio] = useState(peliculaExistente?.precio ?? 0);
    const [estado, setEstado] = useState(peliculaExistente?.estado ?? "Disponible");

    //Guardamos los errores de validacion en un objeto
    const [errores, setErrores] = useState<Record<string, string>>({});

    function validar(): boolean {
        const nuevosErrores: Record<string, string> = {};

        if (codigo.trim() === "") {
            nuevosErrores.codigo = "El codigo es obligatorio.";
        } else if (!esEdicion && peliculas.some((p) => p.codigo.toLowerCase() === codigo.trim().toLowerCase())) {
            nuevosErrores.codigo = "Ya existe una pelicula con este codigo";
        }
        
        if(nombre.trim() === "") {
            nuevosErrores.nombre = "El nombre es obligatorio.";
        }

        if(duracionMinutos <= 0) {
            nuevosErrores.duracionMinutos = "La duracion debe ser mayor a 0";
        }

        if(precio < 0) {
            nuevosErrores.precio = "El precio no puede ser menor a cero.";
        }

        if(salaId === "") {
            nuevosErrores.salaId = "Debes seleccionar una sala.";
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if(!validar()) return;

        const peliculaData: Pelicula = {
            codigo: codigo.trim(),
            nombre: nombre.trim(),
            genero,
            duracionMinutos,
            clasificacion,
            salaId,
            precio,
            estado,
        };

        if (esEdicion) {
            dispatch(actualizarPelicula(peliculaData));
        } else {
            dispatch(agregarPelicula(peliculaData));
        }

        onCerrar();
    }

    return (
        <div className="card" style={{background: "var(--color-bg-soft)"}}>
            <h2>{esEdicion ? "Editar Pelicula" : "Nueva Pelicula"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                <div className={`form-field ${errores.codigo ? "has-error" : ""}`}>
                    <label>Codigo</label>
                    <input 
                        type="text"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        disabled={esEdicion} 
                    />
                    {errores.codigo && <span className="field-error">{errores.codigo}</span>}
                </div>

                <div className={`form-field ${errores.nombre ? "has-error" : ""}`}>
                    <label>Nombre</label>
                    <input 
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    {errores.nombre && <span className="field-error">{errores.nombre}</span>}
                </div>

                <div className="form-field">
                    <label>Genero</label>
                    <select value={genero} onChange={(e) => setGenero(e.target.value as GeneroPelicula)}>
                        {GENEROS.map((g) => (
                            <option key={g} value={g}>
                                {g}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={`form-field ${errores.duracionMinutos ? "has-error" : ""}`}>
                    <label>Duracion (min)</label>
                    <input 
                        type="number"
                        value={duracionMinutos}
                        onChange={(e) => setDuracionMinutos(Number(e.target.value))}
                    />
                    {errores.duracionMinutos && (
                        <span className="field-error">{errores.duracionMinutos}</span>
                    )}
                </div>

                <div className="form-field">
                    <label>Clasificacion</label>
                    <select
                    value={clasificacion}
                    onChange={(e) => setClasificacion(e.target.value as ClasificacionPelicula)}
                    >
                    {CLASIFICACIONES.map((c) => (
                        <option key={c} value={c}>
                        {c}
                        </option>
                    ))}
                    </select>
                </div>

                <div className={`form-field ${errores.salaId ? "has-error" : ""}`}>
                    <label>Sala</label>
                    <select value={salaId} onChange={(e) => setSalaId(e.target.value)}>
                    {salas.map((s) => (
                        <option key={s.id} value={s.id}>
                        {s.nombre}
                        </option>
                    ))}
                    </select>
                    {errores.salaId && <span className="field-error">{errores.salaId}</span>}
                </div>

                <div className={`form-field ${errores.precio ? "has-error" : ""}`}>
                    <label>Precio</label>
                    <input
                    type="number"
                    step="0.01"
                    value={precio}
                    onChange={(e) => setPrecio(Number(e.target.value))}
                    />
                    {errores.precio && <span className="field-error">{errores.precio}</span>}
                </div>

                <div className="form-field">
                    <label>Estado</label>
                    <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value as Pelicula["estado"])}
                    >
                    <option value="Disponible">Disponible</option>
                    <option value="No disponible">No disponible</option>
                    </select>
                </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                        {esEdicion ? "Guardar cambios" : "Agregar pelicula"}
                    </button>
                    <button type="button" className=" btn btn-secondary" onClick={onCerrar}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}