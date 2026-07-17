// Una Reserva registra la compra: que funcion, que asientos,
// cuantos boletos y el total pagado. Con esto el Dashboard
// puede calcular ingresos, boletos vendidos y película más reservada
// sin necesidad de recorrer todo el árbol de funciones/asientos.

export interface Reserva {
    id: string;
    funcionId: string; //Referencia a Funcion.id
    peliculaCodigo: string; //Referencia a Pelicula.codigo
    asientosIds: string[];
    cantidadBoletos: number;
    total: number;
    fechaHora: string; //Fecha y hora de la reserva

}