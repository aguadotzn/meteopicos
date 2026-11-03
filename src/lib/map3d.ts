// Mapa 3D de Picos de Europa con MapLibre GL: OpenTopoMap sobre el relieve de Mapterhorn
// (MDT de 2 m del IGN para España). Solo lo cargan las páginas que lo usan.
import { FullscreenControl, Map, Marker, NavigationControl, setWorkerUrl, type LngLatBoundsLike } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import 'maplibre-gl/dist/maplibre-gl.css';

setWorkerUrl(workerUrl);

export const PICOS_BOUNDS: LngLatBoundsLike = [
  [-5.02, 43.14],
  [-4.70, 43.27],
];

const ATTRIBUTION = [
  'Mapa © <a href="https://opentopomap.org">OpenTopoMap</a> (CC BY-SA)',
  'Datos © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  'Relieve <a href="https://mapterhorn.com/attribution">Mapterhorn</a>: MDT02 © <a href="https://www.scne.es/">IGN España</a> (CC BY 4.0)',
].join(' · ');

export function createMap3D(container: HTMLElement, bounds: LngLatBoundsLike = PICOS_BOUNDS): Map {
  const map = new Map({
    container,
    bounds,
    fitBoundsOptions: { padding: 12 },
    pitch: 55,
    bearing: -15,
    maxPitch: 80,
    attributionControl: { compact: true },
    style: {
      version: 8,
      sources: {
        topo: {
          type: 'raster',
          tiles: ['https://a.tile.opentopomap.org/{z}/{x}/{y}.png', 'https://b.tile.opentopomap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          maxzoom: 17,
          attribution: ATTRIBUTION,
        },
        dem: {
          type: 'raster-dem',
          tiles: ['https://tiles.mapterhorn.com/{z}/{x}/{y}.webp'],
          tileSize: 512,
          maxzoom: 14,
          encoding: 'terrarium',
        },
      },
      layers: [
        { id: 'topo', type: 'raster', source: 'topo' },
        {
          id: 'hillshade',
          type: 'hillshade',
          source: 'dem',
          paint: { 'hillshade-exaggeration': 0.25, 'hillshade-shadow-color': '#3b3127' },
        },
      ],
      terrain: { source: 'dem', exaggeration: 1.3 },
      sky: {},
    },
  });
  map.addControl(new NavigationControl({ visualizePitch: true }), 'top-right');
  map.addControl(new FullscreenControl(), 'top-right');
  // La atribución compacta arranca desplegada y tapa el mapa en móvil: se pliega al cargar.
  map.once('load', () => container.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show'));
  // Las etiquetas de los marcadores solo se muestran a partir de cierto zoom.
  const labels = () => container.classList.toggle('zoomed', map.getZoom() >= 12.5);
  map.on('zoomend', labels);
  map.once('load', labels);
  return map;
}

export interface MarkerOptions {
  lon: number;
  lat: number;
  html: string;
  className: string;
  label: string;
  onClick?: () => void;
}

export function addMarker(map: Map, o: MarkerOptions) {
  const el = document.createElement('button');
  el.type = 'button';
  el.className = `m3d ${o.className}`;
  el.innerHTML = o.html;
  el.setAttribute('aria-label', o.label);
  el.title = o.label;
  if (o.onClick) el.addEventListener('click', o.onClick);
  return new Marker({ element: el, anchor: 'bottom' }).setLngLat([o.lon, o.lat]).addTo(map);
}
