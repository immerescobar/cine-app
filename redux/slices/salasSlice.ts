import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Sala, Asiento } from "../../types/asiento";
import type { Funcion } from "../../types/funcion";
import type { RootState } from "../store";

interface SalasState {
  salas: Sala[];
  funciones: Funcion[];
}

// Genera la matriz de asientos de una sala: A1..A5, B1..B5, etc.
// Se llama SOLO al crear una función nueva, así cada función tiene
// su propio mapa de asientos independiente.
function generarAsientos(filas: number, columnas: number): Asiento[] {
  const asientos: Asiento[] = [];
  for (let f = 0; f < filas; f++) {
    const letraFila = String.fromCharCode(65 + f); // 65 = 'A'
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
      }>
    ) => {
      const sala = state.salas.find((s) => s.id === action.payload.salaId);
      if (!sala) return;

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
    reservarAsientos: (
      state,
      action: PayloadAction<{ funcionId: string; asientosIds: string[] }>
    ) => {
      const funcion = state.funciones.find(
        (f) => f.id === action.payload.funcionId
      );
      if (!funcion) return;

      funcion.asientos = funcion.asientos.map((asiento) =>
        action.payload.asientosIds.includes(asiento.id)
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