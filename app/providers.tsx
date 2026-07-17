"use client";

// Este componente conecta Redux con React: envuelve toda la aplicacion
// y le da a CUALQUIER componente hijo (sin importar que tan anidado este)
// acceso directo al store global (peliculas, salas, reservas), sin tener
// que pasar props manualmente de padre a hijo en cada nivel.
// Se marca "use client" porque usa React Context por debajo, y eso
// solo puede ejecutarse en el navegador, no en el servidor de Next.js.

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
}