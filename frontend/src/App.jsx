import { useState } from 'react';
import ProductList from './components/ProductList';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      <nav className="navbar glass">
        <div className="container nav-content">
          <div className="logo">TPO<span>Frontend</span></div>
          <div className="nav-links">
            <button onClick={toggleTheme} className="theme-toggle">
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>

      {/* Aquí es donde ahora vive tu lista de productos, sin vueltas */}
      <main style={{ marginTop: '100px' }}>
        <ProductList />
      </main>

      <footer className="footer glass">
        <div className="container">
          <p>&copy; 2026 TPO Project. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
