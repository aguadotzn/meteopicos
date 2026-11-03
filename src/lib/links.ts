// Enlaces externos. De Wikiloc solo se enlaza: sus condiciones no permiten reutilizar sus datos.

// Mapa de Wikiloc con las rutas de la comunidad alrededor de un punto (~2 km).
export function wikilocUrl(lat: number, lon: number) {
  const sw = `${(lat - 0.02).toFixed(4)},${(lon - 0.025).toFixed(4)}`;
  const ne = `${(lat + 0.02).toFixed(4)},${(lon + 0.025).toFixed(4)}`;
  return `https://es.wikiloc.com/wikiloc/map.do?${new URLSearchParams({ sw, ne, page: '1' })}`;
}
