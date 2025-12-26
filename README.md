# Nano Banana Pro Image Agent

Genera imágenes a partir de descripciones en lenguaje natural utilizando el modelo Nano Banana Pro. Incluye una experiencia tipo agente que captura el prompt del usuario, parámetros creativos y devuelve la imagen resultante.

## Requisitos

- Node.js 18+
- npm 9+
- Variables de entorno:
  - `NANOBANANA_API_KEY`: token de acceso para el endpoint Nano Banana Pro.
  - `NANOBANANA_API_BASE` (opcional): URL base del proveedor si difiere del valor por defecto `https://api.nano-banana.pro/v1`.

## Puesta en marcha

```bash
npm install
npm run dev
```

Visita `http://localhost:3000` para interactuar con el agente.

## Scripts disponibles

- `npm run dev` – arranca el entorno de desarrollo.
- `npm run build` – construye la aplicación para producción.
- `npm start` – sirve la build resultante.
- `npm run lint` – ejecuta ESLint con configuración basada en Next.js 16.

## Arquitectura

- `app/` – layout, página principal y rutas de la App Router.
- `components/` – componentes UI y el panel del agente.
- `app/api/generate/route.ts` – API route que orquesta la llamada a Nano Banana Pro, normaliza la respuesta y maneja errores.
- `types/csstype.d.ts` – tipado mínimo para `csstype` que evita incompatibilidades en entornos donde el paquete oficial no se resuelve correctamente.

## Despliegue

La aplicación está lista para ser desplegada en Vercel con:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-de452290
```

Asegúrate de configurar las variables de entorno en el proyecto de Vercel antes de desplegar.
