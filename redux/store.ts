import { configureStore } from "@reduxjs/toolkit";
import peliculasReducer from "./slices/peliculaSlice";
import salasReducer from "./slices/salasSlice";
import reservasReducer from "./slices/reservasSlice";

// configureStore junta todos los "slices" (rebanadas de estado)
// en un único árbol de estado global. El nombre de cada clave aquí
// (peliculas, salas, reservas) es el nombre bajo el que vivirá
// ese estado dentro de `state` en toda la app.
export const store = configureStore({
  reducer: {
    peliculas: peliculasReducer,
    salas: salasReducer,
    reservas: reservasReducer,
  },
});

// Estos dos tipos son la base de "Redux + TypeScript tipado".
// RootState: la forma completa del estado global (para useSelector).
// AppDispatch: el tipo del dispatch de ESTE store en particular.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;