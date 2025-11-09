function Sidebar({ rutas, rutaSeleccionada, onRutaChange, buses }) {
  return (
    <div className="sidebar">
      <div className="route-selector">
        <h2>📍 Seleccionar Ruta</h2>
        <div className="route-buttons">
          {Object.entries(rutas).map(([key, ruta]) => (
            <button
              key={key}
              className={`route-button ${rutaSeleccionada === key ? 'active' : ''}`}
              onClick={() => onRutaChange(key)}
            >
              <div>
                <div className="route-name">{ruta.nombre}</div>
                <div className="route-direction">{ruta.direccion}</div>
              </div>
              <div style={{ fontSize: '1.5rem' }}>
                {ruta.direccion === 'Ida' ? '→' : '←'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bus-list">
        <h2>🚌 Buses Activos</h2>
        {buses.length === 0 ? (
          <p style={{ color: '#999', fontSize: '0.9rem', marginTop: '1rem' }}>
            No hay buses activos en esta ruta
          </p>
        ) : (
          buses.map(bus => (
            <div key={bus.id} className={`bus-item ${bus.esUsuario ? 'bus-usuario' : ''} ${bus.esSimulado ? 'bus-simulado' : ''}`}>
              <h3>
                {bus.nombre}
                {bus.esUsuario && <span className="badge-usuario">Tu bus</span>}
                {bus.esSimulado && <span className="badge-simulado">Demo</span>}
              </h3>
              <div className="bus-info">
                {!bus.esSimulado && (
                  <>
                    <div>
                      <strong>Conductor:</strong> {bus.conductor}
                    </div>
                    {bus.pasajeros !== '-' && (
                      <div>
                        <strong>Pasajeros:</strong> {bus.pasajeros}
                      </div>
                    )}
                  </>
                )}
                <div>
                  <span className={`bus-status ${bus.esUsuario ? 'status-usuario' : ''} ${bus.esSimulado ? 'status-simulado' : ''}`}>
                    {bus.esReal ? '📍 GPS activo' : bus.estado}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="help-section">
        <strong>💡 Cómo usar:</strong>
        <ul>
          <li>Selecciona una ruta para ver el recorrido</li>
          <li>El bus 🚌 se mueve en tiempo real</li>
          <li>El marcador verde (I) es el inicio</li>
          <li>El marcador rojo (F) es el fin</li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
