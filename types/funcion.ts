import { Asiento } from "./asiento";

// Una Función es "la película X, en la sala Y, a la hora Z".
// El PDF pide poder "seleccionar una funcion" en el Modulo 2,
// y validar que "no se repita horario en la misma sala" 
// esto solo es posible si modelamos la funcion como una entidad propia,
// separada de la Pelicula y de la Sala.

export interface Funcion {
    id: string; //Id unico de la funcion
    peliculaCodigo: string; //Referencia a Pelicula.codigo
    salaId: string; //Referencia a Sala.id
    horario: string; 
    asientos: Asiento[]; //Matriz de asientos generada para la Sala
}