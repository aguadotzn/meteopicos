// Fuentes de datos y cartografía citadas en el footer.
export interface Source {
  name: string;
  url: string;
  use: string;
  license?: string;
}

export const sources: Source[] = [
  {
    name: 'AEMET',
    url: 'https://www.aemet.es/',
    use: 'Predicción oficial y avisos',
    license: '© AEMET',
  },
  {
    name: 'Open-Meteo',
    url: 'https://open-meteo.com/',
    use: 'Previsión por puntos y altitudes',
    license: 'CC BY 4.0',
  },
  {
    name: 'El tiempo de Javimo',
    url: 'https://www.eltiempodejavimo.es/',
    use: 'Análisis y referencia meteorológica',
  },
  {
    name: 'OpenStreetMap',
    url: 'https://www.openstreetmap.org/copyright',
    use: 'Cartografía base',
    license: 'ODbL',
  },
  {
    name: 'OpenTopoMap',
    url: 'https://opentopomap.org/',
    use: 'Mapa topográfico',
    license: 'CC BY-SA',
  },
  {
    name: 'RainViewer',
    url: 'https://www.rainviewer.com/',
    use: 'Radar de precipitación y satélite',
  },
  {
    name: 'Webcams de Asturias',
    url: 'https://www.webcamsdeasturias.com/',
    use: 'Webcams enlazadas en el mapa',
  },
];
