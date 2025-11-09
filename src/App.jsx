import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import Sidebar from './components/Sidebar'
import UserLocation from './components/UserLocation'
import './App.css'

// Importar las rutas
import rutaAIda from '../rutas/a_ida.json'
import rutaARetorno from '../rutas/a_retorno.json'
import rutaBIda from '../rutas/b_ida.json'
import rutaBRetorno from '../rutas/b_retorno.json'

const RUTAS = {
  'a-ida': { nombre: 'Ruta A', direccion: 'Ida', data: rutaAIda, color: '#2196F3' },
  'a-retorno': { nombre: 'Ruta A', direccion: 'Retorno', data: rutaARetorno, color: '#1976D2' },
  'b-ida': { nombre: 'Ruta B', direccion: 'Ida', data: rutaBIda, color: '#4CAF50' },
  'b-retorno': { nombre: 'Ruta B', direccion: 'Retorno', data: rutaBRetorno, color: '#388E3C' }
}

function App() {
  const [rutaSeleccionada, setRutaSeleccionada] = useState('a-ida')
  const [buses, setBuses] = useState([])
  const [posicionActual, setPosicionActual] = useState(null)
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null)
  const [busesReales, setBusesReales] = useState([])
  const [modoSimulacion, setModoSimulacion] = useState(true)

  // Manejar ubicación del usuario
  const handleLocationUpdate = (ubicacion) => {
    setUbicacionUsuario(ubicacion)
    
    if (ubicacion) {
      // Agregar o actualizar el bus real en la lista
      setBusesReales(prev => {
        const busExistente = prev.find(b => b.id === 'usuario-actual')
        
        if (busExistente) {
          // Actualizar posición del bus existente
          return prev.map(b => 
            b.id === 'usuario-actual' 
              ? { ...b, ...ubicacion, ultimaActualizacion: Date.now() }
              : b
          )
        } else {
          // Agregar nuevo bus
          return [...prev, {
            id: 'usuario-actual',
            nombre: 'Tu Bus',
            ruta: rutaSeleccionada,
            ...ubicacion,
            esUsuario: true,
            ultimaActualizacion: Date.now()
          }]
        }
      })
      
      // Desactivar modo simulación cuando hay ubicación real
      setModoSimulacion(false)
    } else {
      // Remover el bus del usuario cuando detiene el rastreo
      setBusesReales(prev => prev.filter(b => b.id !== 'usuario-actual'))
      setModoSimulacion(true)
    }
  }

  // Simular posición del bus (solo en modo simulación)
  useEffect(() => {
    if (!modoSimulacion) return // No simular si hay ubicación real

    const ruta = RUTAS[rutaSeleccionada]
    if (!ruta || !ruta.data.features) return

    // Obtener coordenadas de la ruta
    const coordenadas = ruta.data.features[0]?.geometry?.coordinates || []
    if (coordenadas.length === 0) return

    let indice = 0
    const intervalo = setInterval(() => {
      // Simular movimiento del bus a lo largo de la ruta
      const coord = coordenadas[indice]
      setPosicionActual({
        lat: coord[1],
        lng: coord[0],
        ruta: rutaSeleccionada,
        esSimulado: true
      })

      indice = (indice + 1) % coordenadas.length
    }, 2000) // Actualizar cada 2 segundos

    return () => clearInterval(intervalo)
  }, [rutaSeleccionada, modoSimulacion])

  // Actualizar lista de buses mostrados
  useEffect(() => {
    if (busesReales.length > 0) {
      // Mostrar buses reales con información
      const busesConInfo = busesReales.map(bus => ({
        ...bus,
        conductor: bus.esUsuario ? 'Tú' : 'Desconocido',
        pasajeros: bus.esUsuario ? '-' : Math.floor(Math.random() * 30) + 5,
        estado: 'En ruta (GPS activo)',
        esReal: true
      }))
      setBuses(busesConInfo)
    } else if (modoSimulacion) {
      // Mostrar bus simulado solo si no hay buses reales
      const busesSimulados = [
        {
          id: 'simulado-1',
          nombre: 'Bus Simulado',
          ruta: rutaSeleccionada,
          conductor: 'Simulación',
          pasajeros: 15,
          estado: 'Simulado',
          esSimulado: true
        }
      ]
      setBuses(busesSimulados)
    } else {
      setBuses([])
    }
  }, [rutaSeleccionada, busesReales, modoSimulacion])

  return (
    <div className="app-container">
      <header className="header">
        <h1>🚌 Rutas Verdes - Sincelejo</h1>
        <p>Seguimiento en tiempo real de buses urbanos</p>
      </header>
      
      <div className="main-content">
        <Sidebar 
          rutas={RUTAS}
          rutaSeleccionada={rutaSeleccionada}
          onRutaChange={setRutaSeleccionada}
          buses={buses}
        />
        
        <div className="map-container">
          <MapView 
            ruta={RUTAS[rutaSeleccionada]}
            posicionBus={ubicacionUsuario || posicionActual}
            busesReales={busesReales}
            modoSimulacion={modoSimulacion}
          />
          
          <UserLocation 
            onLocationUpdate={handleLocationUpdate}
            rutaActual={rutaSeleccionada}
          />
        </div>
      </div>
    </div>
  )
}

export default App
