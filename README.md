# Meteo Picos de Europa

Web del tiempo en los Picos de Europa: previsión por macizos (Cornión, Urrieles, Ándara) y valles de acceso, mapas interactivos y boletines. Inspirada en [meteopirineo.es](https://meteopirineo.es/).

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:4321/meteopicos
npm run build    # genera dist/
```

## Boletines

1. `npm run boletin:borrador` crea `src/content/boletines/AAAA-MM-DD.md` con los datos actuales de Open-Meteo y `draft: true`.
2. Completa los `TODO` (titular, resumen y situación general) y revisa las cifras con AEMET.
3. Con `npm run dev` se ven los borradores marcados como «Borrador».
4. Cambia a `draft: false`, haz commit y push para publicarlo.

## Despliegue

Cada push a `main` publica en GitHub Pages mediante `.github/workflows/deploy.yml`.

## Fuentes

AEMET, Open-Meteo (CC BY 4.0), El tiempo de Javimo, OpenStreetMap (ODbL) y RainViewer. Ver `src/data/sources.ts`.

La información es orientativa; consulta siempre la predicción oficial antes de salir a la montaña.
