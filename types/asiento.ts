//Estado de un asiento en la sala de cine
// El estado del asiento vive por FUNCIÓN, no por sala física,
// porque el mismo asiento físico puede estar reservado
// en la función de las 3:00pm pero libre en la de las 7:00pm.

export type EstadoAsiento = "Disponible" | "Reservado";

export interface Asiento {
    id: string; //Id unico del asiento
    fila: string;
    numero: number;
    estado: EstadoAsiento; //Estado del asiento en la funcion
}

// Una Sala es la infraestructura física del cine: cuántas filas
// y columnas tiene. A partir de esto generamos la matriz de asientos
// cuando se crea una Función.

export interface Sala {
    id: string; //Id unico de la sala
    nombre: string;
    filas: number; //Cantidad de filas de asientos
    columnas: number; //Cantidad de columnas de asientos
}