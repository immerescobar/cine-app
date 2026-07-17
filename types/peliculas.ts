//Estado de disponibilidad de la pelicula
//Usamos un "union type" de strings literales en vez de un string libre:
// así TypeScript nos avisa si escribimos "Disponibl" por error.

export type EstadoPelicula = "Disponible" | "No disponible";

//Generos de pelicula, se puede ampliar con mas generos si se desea
export type GeneroPelicula = 
    | "Accion"
    | "Comedia"
    | "Drama"
    | "Terror"
    | "Ciencia Ficcion"
    | "Animacion"
    | "Romance"
    | "Suspenso";

//Clasificamos las peliculas por edades
export type ClasificacionPelicula =
    | "A" //Apta para todo publico
    | "B" //No apta para menores de 12 años
    | "C" //No apta para menores de 16 años
    ;

//Especificaciones de peliculas
export interface Pelicula {
    codigo: string; //Codigo unico de la pelicula
    nombre: string;
    genero: GeneroPelicula;
    duracionMinutos: number;
    clasificacion: ClasificacionPelicula;
    salaId: string; //Id de la sala donde se proyecta la pelicula
    precio: number; //Precio de la entrada
    estado: EstadoPelicula; //Estado de disponibilidad de la pelicula
}