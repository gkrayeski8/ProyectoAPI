import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import './SellerDashboard.css';

// Productos mock para la demo
const MOCK_PRODUCTS = [
  { id: 1, titulo: 'Zapatillas Running Pro', category: 'Calzado', price: 45000, stock: 12, urlImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop', activo: true },
  { id: 2, titulo: 'Mochila Urbana 30L', category: 'Accesorios', price: 18500, stock: 5, urlImage: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop', activo: true },
  { id: 3, titulo: 'Auriculares Bluetooth', category: 'Electrónica', price: 32000, stock: 0, urlImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', activo: false },
];

const STATS = [
  { label: 'Productos publicados', value: '3', icon: '📦', sub: '2 activos · 1 sin stock' },
  { label: 'Ventas este mes', value: '14', icon: '🛒', sub: 'Últimos 30 días' },
  { label: 'Ingresos totales', value: '$127.500', icon: '💰', sub: 'Desde el inicio' },
];

/**
 * Componente SellerDashboard
 * Panel del vendedor con stats hardcodeadas y lista de productos mock.
 * Protegido: solo accesible para usuarios con rol VENDEDOR.
 */
export default function SellerDashboard() {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');

  // Guardas de acceso
  if (!isAuthenticated) {
    return (
      <div className="dashboard-guard">
        <p>Debés iniciar sesión para acceder al panel.</p>
        <Link to="/login" className="guard-btn">Iniciar Sesión</Link>
      </div>
    );
  }

  if (user?.role !== 'VENDEDOR') {
    return (
      <div className="dashboard-guard">
        <p>Esta sección es solo para vendedores.</p>
        <Link to="/become-seller" className="guard-btn">Convertirme en Vendedor</Link>
      </div>
    );
  }

  return (
    <div className="seller-dashboard">

      {/* ── Header ────────────────────────────────────────────────── */}
      <div className="dashboard-header">
        <div className="dashboard-header-inner">
          <div>
            <p className="dashboard-eyebrow">Panel de Vendedor</p>
            <h1 className="dashboard-title">Hola, {user.name} 👋</h1>
            <p className="dashboard-subtitle">Acá podés gestionar tus publicaciones y ver tu actividad.</p>
          </div>
          <button
            className="btn-publish-new"
            onClick={() => navigate('/publish-product')}
          >
            <span>+</span> Publicar Producto
          </button>
        </div>
      </div>

      <div className="dashboard-body">

        {/* ── Stats ─────────────────────────────────────────────── */}
        <div className="stats-grid">
          {STATS.map((stat, i) => (
            <div key={i} className="stat-card">
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
                <span className="stat-sub">{stat.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ──────────────────────────────────────────────── */}
        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Mis Productos
          </button>
          <button
            className={`dashboard-tab ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales')}
          >
            Mis Ventas
          </button>
        </div>

        {/* ── Contenido ─────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <div className="products-section">
            <div className="products-grid">
              {MOCK_PRODUCTS.map(product => (
                <div key={product.id} className={`product-card-seller ${!product.activo ? 'inactive' : ''}`}>
                  <div className="product-card-img">
                    <img src={product.urlImage} alt={product.titulo} />
                    <span className={`product-status-badge ${product.stock === 0 ? 'no-stock' : 'active'}`}>
                      {product.stock === 0 ? 'Sin stock' : 'Activo'}
                    </span>
                  </div>
                  <div className="product-card-body">
                    <span className="product-card-category">{product.category}</span>
                    <h3 className="product-card-title">{product.titulo}</h3>
                    <div className="product-card-meta">
                      <span className="product-card-price">${product.price.toLocaleString('es-AR')}</span>
                      <span className="product-card-stock">{product.stock} en stock</span>
                    </div>
                  </div>
                  <div className="product-card-actions">
                    <button className="btn-card-edit">Editar precio</button>
                    <button className="btn-card-delete">Eliminar</button>
                  </div>
                </div>
              ))}

              {/* Card para agregar */}
              <button className="product-card-add" onClick={() => navigate('/publish-product')}>
                <span className="add-icon">+</span>
                <span>Publicar nuevo producto</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="empty-tab">
            <span className="empty-icon">📋</span>
            <p>El historial de ventas estará disponible próximamente.</p>
          </div>
        )}

      </div>
    </div>
  );
}
