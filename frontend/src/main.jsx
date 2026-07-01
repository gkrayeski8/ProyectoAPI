// Punto de entrada de la aplicación React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'        // Habilita el enrutamiento basado en URLs del navegador
import { Provider } from 'react-redux'                  // Pone el store de Redux disponible para toda la app
import { PersistGate } from 'redux-persist/integration/react' // Retrasa el render hasta rehidratar el estado persistido
import { store, persistor } from './store/store.js'     // Store global de Redux y su persistor
import { ThemeProvider } from './context/ThemeProvider.jsx' // Proveedor del tema oscuro/claro
import './index.css'
import App from './App.jsx'

// Monta la app en el div#root del index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Provider inyecta el store de Redux en todos los componentes hijos */}
    <Provider store={store}>
      {/* PersistGate retrasa el render hasta que el estado persistido se rehidrate desde localStorage */}
      <PersistGate loading={null} persistor={persistor}>
        {/* ThemeProvider gestiona el tema global (oscuro/claro) */}
        <ThemeProvider>
          {/* BrowserRouter envuelve la app para permitir la navegación con React Router */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
