import { useEffect } from 'react';
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
                <Link to="/favorites">
                  Favoritos
                </Link>
                <Link to="/cart">
                  Carrito
                </Link>
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
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<AdminPanel />} />
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
