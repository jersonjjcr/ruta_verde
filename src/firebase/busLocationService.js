import { database } from './config'
import { ref, set, onValue, remove, push } from 'firebase/database'

class BusLocationService {
  constructor() {
    this.busesRef = ref(database, 'buses')
    this.currentBusId = null
  }

  // Generar ID único para cada usuario
  generateBusId() {
    return `bus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Compartir ubicación del usuario
  shareLocation(ubicacion, rutaId) {
    if (!this.currentBusId) {
      this.currentBusId = this.generateBusId()
    }

    const busRef = ref(database, `buses/${this.currentBusId}`)
    
    return set(busRef, {
      id: this.currentBusId,
      lat: ubicacion.lat,
      lng: ubicacion.lng,
      ruta: rutaId,
      accuracy: ubicacion.accuracy,
      timestamp: Date.now(),
      ultimaActualizacion: Date.now(),
      activo: true
    })
  }

  // Dejar de compartir ubicación
  stopSharing() {
    if (this.currentBusId) {
      const busRef = ref(database, `buses/${this.currentBusId}`)
      remove(busRef)
      this.currentBusId = null
    }
  }

  // Escuchar todos los buses en tiempo real
  listenToAllBuses(callback) {
    const busesRef = ref(database, 'buses')
    
    const unsubscribe = onValue(busesRef, (snapshot) => {
      const buses = []
      const ahora = Date.now()
      
      snapshot.forEach((childSnapshot) => {
        const bus = childSnapshot.val()
        
        // Solo incluir buses activos en los últimos 2 minutos
        if (bus && ahora - bus.timestamp < 120000) {
          buses.push({
            ...bus,
            esUsuario: bus.id === this.currentBusId,
            nombre: bus.id === this.currentBusId ? 'Tu Bus' : `Bus ${bus.id.slice(-4)}`
          })
        } else if (bus) {
          // Eliminar buses inactivos
          const busRef = ref(database, `buses/${childSnapshot.key}`)
          remove(busRef)
        }
      })
      
      callback(buses)
    })

    return unsubscribe
  }

  // Limpiar al cerrar/salir
  cleanup() {
    this.stopSharing()
  }
}

export default new BusLocationService()
