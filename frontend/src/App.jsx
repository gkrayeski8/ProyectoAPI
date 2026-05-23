import { useState } from 'react';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Registro from './components/Registro';
import AdminPanel from './components/AdminPanel';
import { Link, Routes, Route } from 'react-router-dom';
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
            <Link to="/products" className="nav-item">
              Productos
            </Link>
            <Link to="/login" className="nav-btn">
              Ingresar
            </Link>
            <button onClick={toggleTheme} className="theme-toggle">
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>

      <main style={{ marginTop: '100px' }}>
        <Routes>
            {/* Definimos qué componente se renderiza en cada URL */}
            <Route path="/products" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/products/:id" element={<ProductDetail/>} />
          </Routes>
      </main>

      <footer className="footer glass">
        <div className="container">
          <p>&copy; 2026 TPO. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
