import { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeProvider.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './store/slices/authSlice';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Register from './components/Register';
import Favorites from './components/Favorites';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import { Link, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);
  
  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="container nav-content">
          <Link to="/products" className="logo">
            TPO<span>Market</span>
          </Link>
          <div className="nav-links">
            {isAuthenticated && (
              <>
                <button className="nav-link-btn" onClick={() => setIsFavOpen(true)} title="Favoritos">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                <button className="nav-link-btn" onClick={() => setIsCartOpen(true)} title="Carrito">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </button>
              </>
            )}
            {isAuthenticated ? (
              <div className="user-menu-container">
                <button className="user-avatar">
                  {getInitials(user?.name, user?.email)}
                </button>
                <div className="user-dropdown">
                  <span className="dropdown-greeting">Hola, <strong>{user?.name || user?.email?.split('@')[0] || 'Usuario'}</strong></span>
                  <div className="dropdown-divider"></div>
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin" className="dropdown-item">Administración</Link>
                  )}
                  <button className="dropdown-item logout-btn" onClick={() => dispatch(logout())}>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Registro</Link>
              </>
            )}
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
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Favorites isOpen={isFavOpen} onClose={() => setIsFavOpen(false)} />

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 TPO Market. The premier marketplace community.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
