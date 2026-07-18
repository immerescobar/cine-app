"use client";

// Componente de presentacion: solo dibuja el campo de busqueda y avisa
// al padre cuando cambia el texto. El estado real (el termino buscado y el
// filtrado de la lista) sigue viviendo en TablaPeliculas, asi no duplicamos
// logica ni tocamos la arquitectura de Redux.
interface BuscadorProps {
  valor: string;
  onCambiar: (valor: string) => void;
}

export default function Buscador({ valor, onCambiar }: BuscadorProps) {
  return (
    <div className="form-field">
      <label>Buscar</label>
      <input
        type="text"
        placeholder="Nombre, genero, clasificacion o sala"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
      />
    </div>
  );
}
