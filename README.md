# 🎬 Sistema de Venta de Entradas - Cine

Sistema de gestión y venta de entradas para cine, desarrollado como Desafío Práctico 1C2 2026. Permite administrar películas, salas, funciones y reservas de boletos, con un dashboard de estadísticas en tiempo real.

## 📋 Tabla de Contenidos

- [Tecnologias](#-tecnologias)
- [Requisitos previos](#-requisitos-previos)
- [Instalacion](#-instalacion)
- [Scripts disponibles](#-scripts-disponibles)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Modulos funcionales](#-modulos-funcionales)
- [Arquitectura de Redux](#-arquitectura-de-redux)
- [Validaciones implementadas](#-validaciones-implementadas)
- [Limitaciones conocidas](#-limitaciones-conocidas)
- [Autores](#-autores)

## 🚀 Tecnologias

- **[Next.js 16](https://nextjs.org/)** (App Router) - Framework de React
- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estatico
- **[Redux Toolkit](https://redux-toolkit.js.org/)** + **[React Redux](https://react-redux.js.org/)** - Manejo de estado global
- **CSS puro** (sin frameworks como Tailwind) - Estilos con variables CSS nativas

> **Nota**: este proyecto no usa backend, base de datos ni servicios externos. Todo el estado vive en memoria (Redux) durante la sesion del navegador. Al refrescar la pagina, los datos vuelven a los valores semilla iniciales.

## ✅ Requisitos previos

Antes de instalar, asegurate de tener:

- **[Node.js](https://nodejs.org/)** version 18.18 o superior (recomendado 20+)
- **npm** (se instala junto con Node.js)
- **Git**

Para verificar tus versiones instaladas:

```bash
node --version
npm --version
git --version
```

## 📦 Instalacion

1. Clona el repositorio:

```bash
git clone https://github.com/immerescobar/cine-app.git
cd cine-app
```

2. Instala las dependencias:

```bash
npm install
```

3. Levanta el servidor de desarrollo:

```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### ⚠️ Problemas comunes en Windows

Si al ejecutar `npm` obtienes un error de PowerShell del tipo `no se puede cargar el archivo ... porque la ejecucion de scripts esta deshabilitada`, ejecuta esto una sola vez en PowerShell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## 🛠 Scripts disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo en `http://localhost:3000` |
| `npm run build` | Genera la version de produccion optimizada |
| `npm run start` | Corre la version de produccion (requiere `build` previo) |
| `npm run lint` | Revisa el codigo con ESLint |
| `npx tsc --noEmit` | Verifica errores de TypeScript sin generar archivos |

## 📁 Estructura del proyecto

cine-app/
├── app/
│   ├── layout.tsx        # Layout raiz, envuelve la app con el Provider de Redux
│   ├── providers.tsx     # Componente que conecta Redux con React
│   ├── page.tsx          # Pagina principal: navegacion entre modulos
│   └── globals.css       # Estilos globales (variables CSS, componentes base)
├── components/
│   ├── Dashboard.tsx           # Estadisticas generales
│   ├── TablaPeliculas.tsx      # Listado, busqueda y filtros de peliculas
│   ├── PeliculaFila.tsx        # Fila individual de la tabla de peliculas
│   ├── FormularioPelicula.tsx  # Crear/editar pelicula
│   ├── TablaSalas.tsx          # Listado de salas
│   ├── FormularioSala.tsx      # Crear/editar sala
│   ├── FormularioFuncion.tsx   # Programar funciones (pelicula + sala + horario)
│   ├── FormularioReserva.tsx   # Flujo de reserva de boletos
│   └── MapaAsientos.tsx        # Matriz visual de asientos, interactiva
├── redux/
│   ├── store.ts           # Configuracion del store global
│   ├── hooks.ts            # useAppDispatch / useAppSelector tipados
│   └── slices/
│       ├── peliculaSlice.ts   # Estado y acciones de peliculas
│       ├── salasSlice.ts      # Estado de salas Y funciones
│       └── reservasSlice.ts   # Estado de reservas confirmadas
├── types/
│   ├── peliculas.ts   # Tipos: Pelicula, GeneroPelicula, ClasificacionPelicula
│   ├── asiento.ts      # Tipos: Asiento, Sala
│   ├── funcion.ts      # Tipo: Funcion (pelicula + sala + horario)
│   └── reserva.ts      # Tipo: Reserva
└── package.json

## 🎯 Modulos funcionales

### 1. Dashboard
Panel inicial con metricas calculadas en tiempo real: total de peliculas, salas, funciones programadas, boletos vendidos, asientos disponibles/ocupados, ingresos generados y la pelicula mas reservada.

### 2. Peliculas (CRUD)
Crear, editar y eliminar peliculas. Incluye busqueda por nombre en tiempo real y filtros por genero, clasificacion, sala y disponibilidad.

### 3. Salas
Gestion de las salas fisicas del cine (codigo, nombre, filas y columnas). El sistema impide eliminar una sala si esta siendo usada por alguna pelicula o funcion.

### 4. Funciones
Programacion de proyecciones especificas: se elige una pelicula, una sala y un horario. Al crear una funcion, se genera automaticamente su propia matriz de asientos (todos disponibles), independiente de otras funciones en la misma sala.

### 5. Reservar Boletos
Flujo de compra: seleccionar pelicula disponible → seleccionar funcion → elegir asientos en el mapa visual → confirmar. El total se calcula automaticamente segun la cantidad de asientos seleccionados y el precio de la pelicula.

## 🗂 Arquitectura de Redux

El store global esta compuesto por 3 slices:

store
├── peliculas   → lista de peliculas (CRUD)
├── salas       → salas fisicas Y funciones programadas
└── reservas    → historial de reservas confirmadas

**Decision de diseño**: el estado de "Funcion" (pelicula + sala + horario + asientos) vive dentro del slice de `salas`, ya que esta directamente ligado a la infraestructura fisica del cine. Cada funcion genera su propia matriz de asientos independiente al crearse, para que un mismo asiento fisico pueda estar ocupado en una funcion y disponible en otra.

## ✔️ Validaciones implementadas

- No se permiten codigos de pelicula duplicados
- No se permite crear peliculas sin nombre
- No se permiten precios negativos
- No se pueden reservar asientos ya ocupados (bloqueado visualmente en el mapa de asientos)
- No se permiten funciones con horario repetido en la misma sala
- No se puede eliminar una sala que esta en uso por alguna pelicula o funcion

## ⚠️ Limitaciones conocidas

- El estado se pierde al refrescar la pagina (no hay persistencia ni backend, segun lo requerido por el desafio)
- Cambiar el numero de filas/columnas de una sala existente no afecta las funciones ya creadas (conservan su matriz de asientos original)
- No existe cancelacion de reservas una vez confirmadas

## 👥 Autores

- Immer Escobar ([@immerescobar](https://github.com/immerescobar))