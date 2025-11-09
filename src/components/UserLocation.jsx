import { useState, useEffect } from 'react'

function UserLocation({ onLocationUpdate, rutaActual }) {
  const [enBus, setEnBus] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [error, setError] = useState(null)
  const [rastreando, setRastreando] = useState(false)
  const [watchId, setWatchId] = useState(null)

  // Preguntar si está en el bus al abrir la app
  useEffect(() => {
    const preguntado = sessionStorage.getItem('preguntaRealizada')
    if (!preguntado) {
      setTimeout(() => setMostrarModal(true), 2000)
      sessionStorage.setItem('preguntaRealizada', 'true')
    }
  }, [])

  const iniciarRastreo = () => {
    if (!navigator.geolocation) {
      setError('Tu dispositivo no soporta geolocalización')
      return
    }

    setRastreando(true)
    setError(null)

    // Rastrear ubicación en tiempo real
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const ubicacion = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now(),
          accuracy: position.coords.accuracy
        }
        
        onLocationUpdate(ubicacion)
        console.log('Ubicación actualizada:', ubicacion)
      },
      (error) => {
        console.error('Error de geolocalización:', error)
        setError('No se pudo obtener tu ubicación. Verifica los permisos.')
        setRastreando(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    )

    setWatchId(id)
  }

  const detenerRastreo = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setRastreando(false)
    setEnBus(false)
    onLocationUpdate(null)
  }

  const handleConfirmarEnBus = () => {
    setEnBus(true)
    setMostrarModal(false)
    iniciarRastreo()
  }

  const handleNoEnBus = () => {
    setEnBus(false)
    setMostrarModal(false)
  }

  const toggleRastreo = () => {
    if (rastreando) {
      detenerRastreo()
    } else {
      setMostrarModal(true)
    }
  }

  return (
    <>
      {/* Modal de confirmación */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>🚌 ¿Estás en un bus?</h2>
            <p>Si estás viajando en un bus de Rutas Verdes, activa tu ubicación para que otros usuarios sepan dónde va el bus en tiempo real.</p>
            
            <div className="modal-buttons">
              <button 
                className="btn-primary"
                onClick={handleConfirmarEnBus}
              >
                ✓ Sí, estoy en el bus
              </button>
              <button 
                className="btn-secondary"
                onClick={handleNoEnBus}
              >
                ✗ No, solo consulto
              </button>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botón flotante para activar/desactivar rastreo */}
      <div className="location-control">
        <button
          className={`location-button ${rastreando ? 'active' : ''}`}
          onClick={toggleRastreo}
          title={rastreando ? 'Detener rastreo' : 'Activar rastreo'}
        >
          {rastreando ? (
            <>
              <span className="pulse"></span>
              📍 Rastreando
            </>
          ) : (
            <>📍 Activar ubicación</>
          )}
        </button>

        {rastreando && (
          <div className="location-status">
            <div className="status-dot"></div>
            <span>En el bus - Ubicación activa</span>
          </div>
        )}
      </div>
    </>
  )
}

export default UserLocation
