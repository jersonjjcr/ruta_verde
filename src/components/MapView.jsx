import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix para iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function MapView({ ruta, posicionBus, busesReales = [], modoSimulacion = true }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const polylineRef = useRef(null)
  const busMarkerRef = useRef(null)
  const busesMarkersRef = useRef([])

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Centro de Sincelejo
    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
      tap: true,
      touchZoom: true,
      dragging: true
    }).setView([9.3047, -75.3978], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
      minZoom: 10
    }).addTo(map)

    // Mover controles de zoom en móviles
    if (window.innerWidth < 768) {
      map.zoomControl.setPosition('bottomright')
    }

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Dibujar ruta
  useEffect(() => {
    if (!mapInstanceRef.current || !ruta || !ruta.data.features) return

    // Limpiar polyline anterior
    if (polylineRef.current) {
      polylineRef.current.remove()
    }

    const coordenadas = ruta.data.features[0]?.geometry?.coordinates || []
    if (coordenadas.length === 0) return

    // Convertir coordenadas GeoJSON [lng, lat] a Leaflet [lat, lng]
    const latlngs = coordenadas.map(coord => [coord[1], coord[0]])

    // Crear polyline
    polylineRef.current = L.polyline(latlngs, {
      color: ruta.color,
      weight: 4,
      opacity: 0.7
    }).addTo(mapInstanceRef.current)

    // Ajustar vista al bounds de la ruta
    mapInstanceRef.current.fitBounds(polylineRef.current.getBounds())

    // Agregar marcadores de inicio y fin
    const inicio = latlngs[0]
    const fin = latlngs[latlngs.length - 1]

    const markerSize = window.innerWidth < 768 ? 25 : 30

    L.marker(inicio, {
      icon: L.divIcon({
        html: `<div style="background:#4CAF50; color:white; width:${markerSize}px; height:${markerSize}px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3); font-size:${markerSize > 25 ? '14px' : '12px'}">I</div>`,
        className: '',
        iconSize: [markerSize, markerSize]
      })
    }).addTo(mapInstanceRef.current).bindPopup('Inicio de ruta', { autoPan: false })

    L.marker(fin, {
      icon: L.divIcon({
        html: `<div style="background:#f44336; color:white; width:${markerSize}px; height:${markerSize}px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; border:2px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3); font-size:${markerSize > 25 ? '14px' : '12px'}">F</div>`,
        className: '',
        iconSize: [markerSize, markerSize]
      })
    }).addTo(mapInstanceRef.current).bindPopup('Fin de ruta', { autoPan: false })

  }, [ruta])

  // Actualizar posición del bus (simulado o real)
  useEffect(() => {
    if (!mapInstanceRef.current || !posicionBus) return

    // Limpiar marcador anterior
    if (busMarkerRef.current) {
      busMarkerRef.current.remove()
    }

    const busSize = window.innerWidth < 768 ? 35 : 40
    const emoji = '🚌'
    
    // Color diferente si es simulado vs real
    const backgroundColor = posicionBus.esSimulado ? '#9E9E9E' : '#FF9800'
    const borderColor = posicionBus.esSimulado ? '#757575' : 'white'
    
    const popupText = posicionBus.esSimulado 
      ? 'Bus simulado (Demo)'
      : 'Bus en ruta - GPS activo'

    // Crear marcador del bus
    busMarkerRef.current = L.marker([posicionBus.lat, posicionBus.lng], {
      icon: L.divIcon({
        html: `<div style="background:${backgroundColor}; color:white; width:${busSize}px; height:${busSize}px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:${busSize > 35 ? '1.2rem' : '1rem'}; border:3px solid ${borderColor}; box-shadow:0 2px 8px rgba(0,0,0,0.3)">${emoji}</div>`,
        className: '',
        iconSize: [busSize, busSize]
      })
    }).addTo(mapInstanceRef.current)
      .bindPopup(popupText, { autoPan: false })

  }, [posicionBus])

  // Mostrar todos los buses reales de otros usuarios
  useEffect(() => {
    if (!mapInstanceRef.current) return

    // Limpiar marcadores anteriores
    busesMarkersRef.current.forEach(marker => marker.remove())
    busesMarkersRef.current = []

    // Agregar marcadores para cada bus real
    busesReales.forEach(bus => {
      if (!bus.lat || !bus.lng) return

      const busSize = window.innerWidth < 768 ? 35 : 40
      const esUsuarioActual = bus.esUsuario
      const backgroundColor = esUsuarioActual ? '#4CAF50' : '#2196F3'
      const emoji = '🚌'
      
      const ahora = Date.now()
      const tiempoTranscurrido = ahora - (bus.ultimaActualizacion || 0)
      const minutosTranscurridos = Math.floor(tiempoTranscurrido / 60000)
      
      const popupContent = `
        <div style="min-width: 150px;">
          <strong>${bus.nombre}</strong><br/>
          ${esUsuarioActual ? '<em>Tu ubicación</em>' : 'Bus en ruta'}<br/>
          <small>Última actualización: ${minutosTranscurridos === 0 ? 'Ahora' : `Hace ${minutosTranscurridos} min`}</small>
          ${bus.accuracy ? `<br/><small>Precisión: ${Math.round(bus.accuracy)}m</small>` : ''}
        </div>
      `

      const marker = L.marker([bus.lat, bus.lng], {
        icon: L.divIcon({
          html: `<div style="background:${backgroundColor}; color:white; width:${busSize}px; height:${busSize}px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:${busSize > 35 ? '1.2rem' : '1rem'}; border:3px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3); position:relative;">
            ${emoji}
            ${esUsuarioActual ? '<div style="position:absolute; top:-5px; right:-5px; width:12px; height:12px; background:#4CAF50; border:2px solid white; border-radius:50%; animation: pulse 2s infinite;"></div>' : ''}
          </div>`,
          className: '',
          iconSize: [busSize, busSize]
        })
      }).addTo(mapInstanceRef.current)
        .bindPopup(popupContent, { autoPan: false })

      busesMarkersRef.current.push(marker)

      // Auto-centrar en la ubicación del usuario
      if (esUsuarioActual) {
        mapInstanceRef.current.setView([bus.lat, bus.lng], mapInstanceRef.current.getZoom(), {
          animate: true
        })
      }
    })

  }, [busesReales])

  return <div ref={mapRef} id="map" style={{ width: '100%', height: '100%' }} />
}

export default MapView
