import { useEffect } from 'react';
import { useTheme } from './context/ThemeProvider.jsx';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Register from './components/Register';
import Favorites from './components/Favorites';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container nav-content">
          <Link to="/" className="logo">
            TPO<span>Market</span>
          </Link>
          <div className="nav-links">
            <Link to="/products" className="nav-item">
              Shop
            </Link>
            <Link to="/login" className="nav-btn">
              Login
            </Link>
            <Link to="/favorites" className="nav-btn">
              Favoritos
            </Link>
            <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
              {isDarkMode ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>

      <main style={{ marginTop: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 TPO Market. The premier marketplace community.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
