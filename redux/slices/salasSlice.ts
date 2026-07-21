import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Sala, Asiento } from "../../types/asiento";
import type { Funcion } from "../../types/funcion";
import type { RootState } from "../store";

interface SalasState {
  salas: Sala[];
  funciones: Funcion[];
}

// Genera la etiqueta de una fila a partir de su indice (0 = A).
// Va A..Z y luego AA, AB, AC... como las columnas de una hoja de calculo,
// asi salas con mas de 26 filas siguen mostrando letras validas
// (antes se usaba String.fromCharCode(65 + f) y a partir de la fila 27
// aparecian caracteres como '[', '\', ']'...).
// Para indices 0..25 devuelve exactamente A..Z, por lo que las salas y
// funciones existentes conservan las mismas etiquetas de siempre.
function generarEtiquetaFila(indice: number): string {
  let n = indice;
  let etiqueta = "";
  do {
    etiqueta = String.fromCharCode(65 + (n % 26)) + etiqueta;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return etiqueta;
}

// Genera la matriz de asientos de una sala: A1..A5, B1..B5, etc.
// Se llama SOLO al crear una función nueva, así cada función tiene
// su propio mapa de asientos independiente.
function generarAsientos(filas: number, columnas: number): Asiento[] {
  const asientos: Asiento[] = [];
  for (let f = 0; f < filas; f++) {
    const letraFila = generarEtiquetaFila(f);
    for (let c = 1; c <= columnas; c++) {
      asientos.push({
        id: `${letraFila}${c}`,
        fila: letraFila,
        numero: c,
        estado: "Disponible",
      });
    }
  }
  return asientos;
}

const salasSeed: Sala[] = [
  { id: "S1", nombre: "Sala 1", filas: 8, columnas: 12 },
  { id: "S2", nombre: "Sala 2", filas: 6, columnas: 10 },
];

const initialState: SalasState = {
  salas: salasSeed,
  funciones: [
    {
      id: "F001",
      peliculaCodigo: "P001",
      salaId: "S1",
      horario: "2026-07-15T19:00",
      asientos: generarAsientos(8, 12),
    },
    {
      id: "F002",
      peliculaCodigo: "P002",
      salaId: "S2",
      horario: "2026-07-15T21:30",
      asientos: generarAsientos(6, 10),
    },
  ],
};

const salasSlice = createSlice({
  name: "salas",
  initialState,
  reducers: {
    agregarSala: (state, action: PayloadAction<Sala>) => {
      state.salas.push(action.payload);
    },

    editarSala: (state, action: PayloadAction<Sala>) => {
      const index = state.salas.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.salas[index] = action.payload;
      }
    },

    eliminarSala: (state, action: PayloadAction<string>) => {
      state.salas = state.salas.filter((s) => s.id !== action.payload);
    },

    // Crea una nueva función. El id y los asientos se generan aquí:
    // el componente que despacha esta acción solo envía los datos
    // "de negocio" (qué película, qué sala, a qué hora).
    agregarFuncion: (
      state,
      action: PayloadAction<{
        peliculaCodigo: string;
        salaId: string;
        horario: string;
        peliculaDisponible: boolean;
      }>
    ) => {
      // Proteccion minima en el reducer (B3): no se crean funciones para
      // peliculas que no esten disponibles, aunque el formulario ya filtra.
      // El slice de salas no puede leer el de peliculas, por eso el estado
      // llega en el payload calculado por quien despacha la accion.
      if (!action.payload.peliculaDisponible) return;

      const sala = state.salas.find((s) => s.id === action.payload.salaId);
      if (!sala) return;

      // Guarda de reducer (defensa en profundidad): el formulario ya valida
      // que no se repita horario+sala, pero si la accion se despacha
      // directamente el estado no debe corromperse con horarios duplicados.
      const horarioRepetido = state.funciones.some(
        (f) => f.salaId === action.payload.salaId && f.horario === action.payload.horario
      );
      if (horarioRepetido) return;

      const nuevaFuncion: Funcion = {
        id: `F${Date.now()}`,
        peliculaCodigo: action.payload.peliculaCodigo,
        salaId: action.payload.salaId,
        horario: action.payload.horario,
        asientos: generarAsientos(sala.filas, sala.columnas),
      };
      state.funciones.push(nuevaFuncion);
    },

    eliminarFuncion: (state, action: PayloadAction<string>) => {
      state.funciones = state.funciones.filter((f) => f.id !== action.payload);
    },

    // Marca una lista de asientos como "Reservado" dentro de una función.
    // La operacion es ATOMICA (B2): o se reservan todos los asientos
    // solicitados, o no se reserva ninguno. Si alguno ya esta ocupado,
    // no existe, o hay ids repetidos en la peticion, se aborta sin mutar.
    reservarAsientos: (
      state,
      action: PayloadAction<{ funcionId: string; asientosIds: string[] }>
    ) => {
      const { funcionId, asientosIds } = action.payload;

      const funcion = state.funciones.find((f) => f.id === funcionId);
      if (!funcion) return;

      // Sin asientos no hay nada que reservar.
      if (asientosIds.length === 0) return;

      // No se permiten asientos repetidos dentro de una misma reserva.
      const idsUnicos = new Set(asientosIds);
      if (idsUnicos.size !== asientosIds.length) return;

      // Todos deben existir y estar Disponibles; si no, no se reserva nada.
      const todosReservables = asientosIds.every((id) => {
        const asiento = funcion.asientos.find((a) => a.id === id);
        return asiento !== undefined && asiento.estado === "Disponible";
      });
      if (!todosReservables) return;

      funcion.asientos = funcion.asientos.map((asiento) =>
        idsUnicos.has(asiento.id)
          ? { ...asiento, estado: "Reservado" }
          : asiento
      );
    },
  },
});

export const {
  agregarSala,
  editarSala,
  eliminarSala,
  agregarFuncion,
  eliminarFuncion,
  reservarAsientos,
} = salasSlice.actions;

export const selectSalas = (state: RootState) => state.salas.salas;
export const selectFunciones = (state: RootState) => state.salas.funciones;

export const selectFuncionPorId = (funcionId: string) => (state: RootState) =>
  state.salas.funciones.find((f) => f.id === funcionId);

export const selectSalaPorId = (salaId: string) => (state: RootState) =>
  state.salas.salas.find((s) => s.id === salaId);

export default salasSlice.reducer;