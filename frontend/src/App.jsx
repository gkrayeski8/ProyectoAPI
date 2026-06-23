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
import BecomeSeller from './components/BecomeSeller';
import Profile from './components/Profile';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import './App.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function App() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavOpen, setIsFavOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/publications/categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (err) {
            console.error("Error al cargar categorías en Navbar", err);
        }
    };
    fetchCategories();
  }, []);

  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U';
  };
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setSearchQuery(searchParam);
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <div className="app-container">      <header className="navbar">
        <div className="container nav-container">
          <div className="nav-left">
            <Link to="/" className="logo">
              TPO<span>Market</span>
            </Link>
            
            <div className="categories-wrapper">
              <button className="nav-cat-btn">
                Categorías
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="categories-dropdown">
                <Link to="/products" className="dropdown-cat-link">Todos</Link>
                {categories.map(cat => (
                  <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="dropdown-cat-link">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            
            <Link to="/become-seller" className="nav-sell-btn">Vender</Link>
          </div>
          
          <form onSubmit={handleSearch} className="nav-search-container">
            <input 
              type="text" 
              className="nav-search-input" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="nav-search-btn" title="Buscar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
          
          <div className="nav-right">
              {isAuthenticated && (
                <>
                  <button className="nav-link-btn" onClick={() => alert('Notificaciones próximamente')} title="Notificaciones">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </button>
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
                    <div className="dropdown-header">
                      <span className="user-name">{user?.name || user?.email}</span>
                    </div>
                    <Link to="/profile" className="dropdown-item">Mi Perfil</Link>
                    <Link to="/orders" className="dropdown-item">Mis Compras</Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={() => dispatch(logout())} className="dropdown-item text-danger">Cerrar Sesión</button>
                  </div>
                </div>
              ) : (
                <>
                  <Link to="/login" className="nav-auth-link">Login</Link>
                  <Link to="/register" className="nav-auth-link">Registro</Link>
                </>
              )}
              <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
        </div>
      </header>

      <main style={{ marginTop: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/become-seller" element={<BecomeSeller />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} />
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
