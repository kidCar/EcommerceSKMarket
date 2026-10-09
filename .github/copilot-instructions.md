# Instrucciones de Copilot para este repositorio

## Estructura del repositorio

Este repositorio está dividido intencionalmente en dos proyectos Node independientes:

- `backend/` es un servidor de API Express (`server.js`) que ofrece endpoints CRUD para productos en `http://localhost:3000`.
- `frontend/` es una aplicación Angular generada con Angular CLI 16 (`angular.json`, `src/main.ts`, `src/app/app.module.ts`).

No hay un `package.json` en la raíz ni un proceso de compilación para todo el repositorio. Instala las dependencias y ejecuta los comandos desde el directorio del paquete correspondiente.

## Comandos de compilación, pruebas y validación

Ejecuta estos comandos desde la carpeta del paquete correspondiente.

### Backend

```bash
cd backend
npm install
npm start
npm run dev
```

- `npm start` ejecuta la API con Node en modo de producción.
- `npm run dev` ejecuta el mismo servidor con `nodemon` para el desarrollo local.
- `backend/package.json` no tiene configurada una suite automatizada de pruebas para el backend.
- Para comprobar rápidamente que la API responde, después de iniciarla ejecuta:

```bash
curl http://localhost:3000/api/productos
```

### Frontend

```bash
cd frontend
npm install
npm start
npm run build
npm test
```

- `npm start` inicia el servidor de desarrollo de Angular (`ng serve`), normalmente en `http://localhost:4200`.
- `npm run build` genera el paquete de producción en `frontend/dist/frontend`.
- `npm test` ejecuta las pruebas de Karma/Jasmine mediante Angular CLI.

Ejemplo para ejecutar una prueba específica del frontend:

```bash
cd frontend
npx ng test --watch=false --browsers=ChromeHeadless --include src/app/app.component.spec.ts
```

No hay un comando específico de lint en `frontend/package.json` ni en `backend/package.json`. La validación se realiza principalmente con `ng build`, `ng test` y comprobaciones manuales de la API.

## Arquitectura general

### Frontend (`frontend/`)

La aplicación Angular sigue la estructura estándar de CLI:

- `src/main.ts` inicia la aplicación mediante `AppModule`.
- `src/app/app.module.ts` es el módulo raíz; allí se declara e inicia `AppComponent`.
- `src/app/app.component.ts` y `src/app/app.component.html` conforman el componente y la plantilla principales.
- `angular.json` configura el proceso de compilación y pruebas de Angular.

Actualmente, el frontend es una aplicación inicial sencilla de Angular. No supongas que existe una arquitectura de funcionalidades más amplia que la estructura predeterminada de CLI, salvo que se hayan agregado archivos.

### Backend (`backend/`)

La API es un servidor Express contenido en un solo archivo: `backend/server.js`.

- `app.use(cors())` y `app.use(express.json())` habilitan las solicitudes de origen cruzado y el análisis de JSON.
- Los datos de productos se guardan en un arreglo en memoria, no en una base de datos.
- Las rutas siguen el estilo REST y están bajo `/api/productos`:
  - `GET /api/productos`
  - `POST /api/productos`
  - `PUT /api/productos/:id`
  - `DELETE /api/productos/:id`
- La validación de solicitudes se realiza directamente en los controladores de ruta: `nombre` debe estar presente y `precio` debe ser un número no negativo.

Esta aplicación es intencionalmente ligera: el estado se reinicia al reiniciar el servidor. Cualquier nueva funcionalidad debe tener en cuenta que no hay persistencia.

## Convenciones específicas de este repositorio

- Trata `backend/` y `frontend/` como paquetes separados. No agregues scripts en la raíz para unificarlos, salvo que se incorpore un proceso real para todo el repositorio.
- Al ampliar la interfaz, sigue la estructura Angular existente (`AppModule`, `AppComponent`). La aplicación está basada en componentes y en los valores predeterminados de Angular CLI.
- Mantén los contratos de las rutas de la API alineados con el comportamiento actual de `/api/productos`. El backend espera un cuerpo de solicitud con la forma `{ nombre, precio }` y devuelve JSON con `mensaje` cuando hay errores de validación.
- Para este proyecto pequeño, prefiere los patrones de validación existentes en el backend en lugar de incorporar un framework o una capa de datos nuevos.
- Al cambiar el comportamiento del frontend, ten en cuenta que se ejecuta en un servidor de desarrollo distinto al de la API: el backend usa el puerto 3000 y la interfaz Angular suele usar el puerto 4200.
- No supongas que existe una base de datos o una capa de almacenamiento persistente; el backend guarda los datos en memoria.

## Documentación relevante del repositorio

- `frontend/README.md` contiene la documentación de Angular CLI generada para la aplicación frontend.
- No hay instrucciones de contribución ni archivos de configuración para asistentes de IA en la raíz del repositorio.
