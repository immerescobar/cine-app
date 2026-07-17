//Importamos librerias react-redux
import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Esto crea una version personalizada de useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Igual para dispatch: useAppDispatch() ya sabe que acciones existen en el proyecto
export const useAppDispatch: () => AppDispatch = useDispatch;