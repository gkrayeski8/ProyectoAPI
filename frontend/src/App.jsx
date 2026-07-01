// Imports de React y hooks necesarios
import { useState, useEffect } from 'react';
import { useTheme } from './context/ThemeProvider.jsx';            // Hook para acceder al tema actual
import { useSelector, useDispatch } from 'react-redux';           // Hooks para leer y despachar al store de Redux
import { logoutUser, checkAuthSession } from './store/slices/authSlice'; // Acciones de autenticación
// Importamos todos los componentes de páginas y secciones
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import Login from './components/Login';
import Register from './components/Register';
import Favorites from './components/Favorites';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import BecomeSeller from './components/BecomeSeller';
import Profile from './components/Profile';
import SellerDashboard from './components/SellerDashboard';
import PublishProduct from './components/PublishProduct';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom'; // Herramientas de enrutamiento
import './App.css';

// URL base de la API; se lee del .env o usa el valor por defecto en local
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function App() {
  const { isDarkMode, toggleTheme } = useTheme(); // Estado y función para cambiar el tema visual
  const [isCartOpen, setIsCartOpen] = useState(false);   // Controla si el drawer del carrito está abierto
  const [isFavOpen, setIsFavOpen] = useState(false);     // Controla si el drawer de favoritos está abierto
  const [categories, setCategories] = useState([]);      // Lista de categorías para el menú desplegable
  
  // Carga las categorías del backend al montar el componente (solo una vez)
  useEffect(() => {
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BASE_URL}/publications/categories`);
            if (response.ok) {
                const data = await response.json();
                setCategories(data); // Guardamos las categorías en el estado local
            }
        } catch (err) {
            console.error("Error al cargar categorías en Navbar", err);
        }
    };
    fetchCategories();
  }, []);

  // Retorna la inicial del nombre o email del usuario para mostrar en el avatar
  const getInitials = (name, email) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return 'U'; // Fallback si no hay nombre ni email
  };
  const location = useLocation();   // Objeto con la ruta actual del navegador
  const navigate = useNavigate();   // Función para navegar programáticamente
  const dispatch = useDispatch();   // Función para despachar acciones al store de Redux
  const { isAuthenticated, user } = useSelector(state => state.auth); // Datos de sesión del usuario
  const [searchQuery, setSearchQuery] = useState(''); // Texto actual del buscador

  // Verifica si hay una sesión activa en el servidor al cargar la app
  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);

  // Vuelve al inicio de la página cada vez que cambia la ruta
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Sincroniza el input del buscador con el parámetro 'search' de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search') || '';
    setSearchQuery(searchParam);
  }, [location.search]);

  // Maneja el envío del formulario de búsqueda y navega con el query en la URL
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products'); // Si el campo está vacío, muestra todos los productos
    }
  };

  return (
    <div className="app-container">      <header className="navbar">
        <div className="container nav-container">
          <div className="nav-left">
            {/* Logo con link al home */}
            <Link to="/" className="logo">
              TPO<span>Market</span>
            </Link>
            
            {/* Menú desplegable de categorías */}
            <div className="categories-wrapper">
              <button className="nav-cat-btn">
                Categorías
                {/* Ícono de flecha hacia abajo */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: '4px'}}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div className="categories-dropdown">
                {/* Opción para ver todos los productos sin filtro */}
                <Link to="/products" className="dropdown-cat-link">Todos</Link>
                {/* Genera un link por cada categoría recibida del backend */}
                {categories.map(cat => (
                  <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="dropdown-cat-link">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Botón "Vender": lleva al dashboard si es vendedor, o a la página de registro de vendedor */}
            <Link
              to={isAuthenticated && user?.role === 'VENDEDOR' ? '/seller-dashboard' : '/become-seller'}
              className="nav-sell-btn"
            >
              Vender
            </Link>
          </div>
          
          {/* Barra de búsqueda de productos */}
          <form onSubmit={handleSearch} className="nav-search-container">
            <input 
              type="text" 
              className="nav-search-input" 
              placeholder="Buscar productos..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Actualiza el estado al escribir
            />
            <button type="submit" className="nav-search-btn" title="Buscar">
              {/* Ícono de lupa */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
          
          <div className="nav-right">
              {/* Íconos de notificaciones, favoritos y carrito solo visibles si está autenticado */}
              {isAuthenticated && (
                <>
                  {/* Botón de notificaciones (funcionalidad pendiente) */}
                  <button className="nav-link-btn" onClick={() => alert('Notificaciones próximamente')} title="Notificaciones">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    </svg>
                  </button>
                  {/* Botón para abrir el panel lateral de favoritos */}
                  <button className="nav-link-btn" onClick={() => setIsFavOpen(true)} title="Favoritos">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                  {/* Botón para abrir el panel lateral del carrito */}
                  <button className="nav-link-btn" onClick={() => setIsCartOpen(true)} title="Carrito">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                  </button>
                </>
              )}
              {/* Menú de usuario: si está autenticado muestra avatar con dropdown, si no muestra login/registro */}
              {isAuthenticated ? (
                <div className="user-menu-container">
                  {/* Avatar con la inicial del nombre/email */}
                  <button className="user-avatar">
                    {getInitials(user?.name, user?.email)}
                  </button>
                  {/* Dropdown con opciones del usuario autenticado */}
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <span className="user-name">{user?.name || user?.email}</span>
                    </div>
                    <Link to="/profile" className="dropdown-item">Mi Perfil</Link>
                    <Link to="/orders" className="dropdown-item">Mis Compras</Link>
                    <div className="dropdown-divider"></div>
                    {/* Botón para cerrar sesión: llama al thunk logoutUser */}
                    <button onClick={() => dispatch(logoutUser())} className="dropdown-item text-danger">Cerrar Sesión</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Links de acceso para usuarios no autenticados */}
                  <Link to="/login" className="nav-auth-link">Login</Link>
                  <Link to="/register" className="nav-auth-link">Registro</Link>
                </>
              )}
              {/* Botón para alternar entre tema oscuro y claro */}
              <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
                {isDarkMode ? '☀️' : '🌙'}
              </button>
            </div>
        </div>
      </header>

      {/* Contenido principal: el marginTop compensa la altura del navbar fijo */}
      <main style={{ marginTop: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Definición de todas las rutas de la aplicación */}
        <Routes>
          <Route path="/" element={<ProductList />} />              {/* Página principal */}
          <Route path="/products" element={<ProductList />} />      {/* Lista de productos con filtros */}
          <Route path="/login" element={<Login />} />               {/* Formulario de inicio de sesión */}
          <Route path="/register" element={<Register />} />         {/* Formulario de registro */}
          <Route path="/become-seller" element={<BecomeSeller />} />{/* Landing para convertirse en vendedor */}
          <Route path="/seller-dashboard" element={<SellerDashboard />} /> {/* Panel del vendedor */}
          <Route path="/publish-product" element={<PublishProduct />} />   {/* Formulario para publicar producto */}
          <Route path="/products/:id" element={<ProductDetail />} />{/* Detalle de un producto */}
          <Route path="/admin" element={<AdminPanel />} />          {/* Panel de administración */}
          <Route path="/profile" element={<Profile />} />           {/* Perfil del usuario */}
        </Routes>
      </main>

      {/* Paneles laterales (drawers) que se superponen al contenido */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />       {/* Drawer del carrito */}
      <Favorites isOpen={isFavOpen} onClose={() => setIsFavOpen(false)} />    {/* Drawer de favoritos */}

      {/* Pie de página */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 TPO Market. The premier marketplace community.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
