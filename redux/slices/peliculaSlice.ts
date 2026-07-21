import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Pelicula } from "../../types/peliculas";
import type { RootState } from "../store";

interface PeliculaState {
  peliculas: Pelicula[];
}

const initialState: PeliculaState = {
  peliculas: [
    {
      codigo: "P001",
      nombre: "Guardianes de la Galaxia",
      genero: "Ciencia Ficcion",
      duracionMinutos: 122,
      clasificacion: "B",
      salaId: "S1",
      precio: 4.5,
      estado: "Disponible",
    },
    {
      codigo: "P002",
      nombre: "Fast & Furious",
      genero: "Accion",
      duracionMinutos: 120,
      clasificacion: "C",
      salaId: "S2",
      precio: 4.75,
      estado: "Disponible",
    },
  ],
};

const peliculaSlice = createSlice({
  name: "peliculas",
  initialState,
  reducers: {
    agregarPelicula: (state, action: PayloadAction<Pelicula>) => {
      // Guarda de reducer (defensa en profundidad): el formulario ya valida
      // codigo duplicado, pero si la accion se despacha directamente sin
      // pasar por el formulario, el estado no debe corromperse.
      const yaExiste = state.peliculas.some(
        (p) => p.codigo.toLowerCase() === action.payload.codigo.toLowerCase()
      );
      if (yaExiste) return;

      state.peliculas.push(action.payload);
    },
    eliminarPelicula: (state, action: PayloadAction<string>) => {
      state.peliculas = state.peliculas.filter((p) => p.codigo !== action.payload);
    },
    actualizarPelicula: (state, action: PayloadAction<Pelicula>) => {
      const index = state.peliculas.findIndex((p) => p.codigo === action.payload.codigo);
      if (index !== -1) {
        state.peliculas[index] = action.payload;
      }
    },
    setPeliculas: (state, action: PayloadAction<Pelicula[]>) => {
      state.peliculas = action.payload;
    },
  },
});

export const {
  agregarPelicula,
  eliminarPelicula,
  actualizarPelicula,
  setPeliculas,
} = peliculaSlice.actions;

export const selectPeliculas = (state: RootState) => state.peliculas.peliculas;

export default peliculaSlice.reducer;