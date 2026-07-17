"use client";

import type { Asiento } from "@/types/asiento";

interface MapaAsientosProps {
    asientos: Asiento[];
    asientosSeleccionados: string[];
    onToggleAsiento: (asientoId: string) => void;
}

export default function MapaAsientos({
    asientos,
    asientosSeleccionados,
    onToggleAsiento,
}: MapaAsientosProps) {
    // Agrupamos los asientos por fila para poder dibujarlos como una matriz.
    // Reduce recorre el array una vez y va construyendo un objeto:
    // { A: [asiento1, asiento2, ...], B: [...], ... }
    const filas = asientos.reduce<Record<string, Asiento[]>>((acc, asiento) => {
        if(!acc[asiento.fila]) {
            acc[asiento.fila] = [];
        }
        acc[asiento.fila].push(asiento);
        return acc;
    }, {});

    return (
        <div>
            <div className="screen">PANTALLA</div>
            <div className="seat-map">
                {Object.entries(filas).map(([letraFila, asientosDeFila]) => (
                    <div className="seat-row" key={letraFila}>
                        {asientosDeFila.map((asiento) => {
                            const estaSeleccionado = asientosSeleccionados.includes(asiento.id);
                            const estaOcupado = asiento.estado === "Reservado";

                            let clase = "seat";
                            if(estaOcupado) {
                                clase += " occupied";
                            } else if (estaSeleccionado) {
                                clase += " selected";
                            } else {
                                clase += " available";
                            }

                            return (
                                <button
                                    key={asiento.id}
                                    type="button"
                                    className={clase}
                                    disabled={estaOcupado}
                                    onClick={() => onToggleAsiento(asiento.id)}
                                    title={
                                        estaOcupado
                                            ? `${asiento.id} - Ocupado`
                                            : `${asiento.id} - Disponible`
                                    }
                                >
                                    {asiento.id}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="flex gap-4 text-muted" style={{ fontSize: "0.8rem", justifyContent: "center"}}>
                <span>🟩 Disponible</span>
                <span>🟥 Seleccionado</span>
                <span>⬛ Ocupado</span>
            </div>
        </div>
    );
}