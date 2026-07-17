import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Reserva } from "../../types/reserva";
import type { RootState } from "../store";

interface ReservasState {
  reservas: Reserva[];
}

const initialState: ReservasState = {
  reservas: [],
};

const reservasSlice = createSlice({
  name: "reservas",
  initialState,
  reducers: {
    agregarReserva: (state, action: PayloadAction<Reserva>) => {
      state.reservas.push(action.payload);
    },
  },
});

export const { agregarReserva } = reservasSlice.actions;

export const selectReservas = (state: RootState) => state.reservas.reservas;

export default reservasSlice.reducer;