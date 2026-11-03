// Refugios, cumbres y webcams del mapa.
// Refugios y cumbres: coordenadas y altitudes de OpenStreetMap (© colaboradores de OSM, ODbL).
// Webcams: solo enlazadas a la web de su proveedor; coordenadas aproximadas.

export interface Place {
  name: string;
  lat: number;
  lon: number;
  altitude?: number;
  url?: string;
  note?: string;
}

export const huts: Place[] = [
  { name: 'Refugio de Vegarredonda', lat: 43.2344, lon: -4.9929, altitude: 1460, url: 'https://www.refugiovegarredonda.com/' },
  { name: 'Refugio Vega de Ario', lat: 43.2429, lon: -4.9231, altitude: 1624, url: 'https://www.refugiovegadeario.es/' },
  { name: 'Refugio de Vegabaño', lat: 43.1661, lon: -5.005, altitude: 1432, url: 'http://www.refugiopicos.com/' },
  { name: 'Refugio de Urriellu', lat: 43.2027, lon: -4.8213, altitude: 1953, url: 'https://www.refugiodeurriellu.com/' },
  { name: 'Refugio Jou de los Cabrones', lat: 43.2141, lon: -4.8575, altitude: 2034, url: 'http://www.refugiojoudeloscabrones.com/' },
  { name: 'Refugio Collado Jermoso', lat: 43.1729, lon: -4.8692, altitude: 2064, url: 'http://www.colladojermoso.com/' },
  { name: 'Refugio Cabaña Verónica', lat: 43.1761, lon: -4.8342, altitude: 2325, url: 'https://www.fcdme.es/pagina/refugios-montana-fcdme' },
  { name: 'Refugio de la Terenosa', lat: 43.2271, lon: -4.7927, altitude: 1300, url: 'https://fempa.net/refugios/la-terenosa' },
  { name: 'Refugio Casetón de Ándara', lat: 43.214, lon: -4.7121, altitude: 1725, url: 'http://www.casetondeandara.com' },
];

export const peaks: Place[] = [
  // Cornión
  { name: 'Peña Santa', lat: 43.2019, lon: -4.9623, altitude: 2596 },
  { name: 'Torre de Santa María', lat: 43.2125, lon: -4.9745, altitude: 2485 },
  // Urrieles
  { name: 'Torre Cerredo', lat: 43.1978, lon: -4.8529, altitude: 2649, note: 'Techo de la cordillera Cantábrica' },
  { name: 'Torre de Llambrión', lat: 43.1733, lon: -4.857, altitude: 2647 },
  { name: 'Torre Blanca', lat: 43.1728, lon: -4.8517, altitude: 2617 },
  { name: 'Peña Vieja', lat: 43.174, lon: -4.8101, altitude: 2614 },
  { name: 'Picu Urriellu (Naranjo de Bulnes)', lat: 43.2008, lon: -4.8177, altitude: 2518 },
  // Ándara
  { name: 'Morra de Lechugales', lat: 43.1902, lon: -4.7338, altitude: 2444 },
  { name: 'Pico Cortés', lat: 43.1844, lon: -4.7435, altitude: 2371 },
];

export const webcams: Place[] = [
  {
    name: 'Lago Enol',
    lat: 43.2712,
    lon: -4.9925,
    url: 'https://www.webcamsdeasturias.com/asturias/oriente/cangas-de-onis/cangas-de-onis/lagos-de-covadonga-lago-enol-hd/159/',
  },
  {
    name: 'Refugio Vega de Ario',
    lat: 43.2429,
    lon: -4.9231,
    url: 'https://www.webcamsdeasturias.com/asturias/oriente/cangas-de-onis/vega-de-ario/refugio-marques-villaviciosa-vega-ario/177/',
  },
  {
    name: 'Naranjo de Bulnes desde Camarmeña',
    lat: 43.2556,
    lon: -4.8225,
    url: 'https://www.webcamsdeasturias.com/asturias/picos-de-europa/cabrales/camarmena/picu-urriellu-naranjo-de-bulnes-hd/43/',
  },
  {
    name: 'Poncebos (Ruta del Cares)',
    lat: 43.2563,
    lon: -4.8296,
    url: 'https://www.webcamsdeasturias.com/asturias/oriente/cabrales/poncebos/poncebos-ruta-del-cares-hd/22/',
  },
  {
    name: 'Cangas de Onís (Puente Romano)',
    lat: 43.3496,
    lon: -5.1338,
    url: 'https://www.webcamsdeasturias.com/asturias/oriente/cangas-de-onis/cangas-de-onis/puente-romano-hd/34/',
  },
];
