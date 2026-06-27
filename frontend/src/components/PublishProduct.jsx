import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { publishProduct, resetSuccess } from '../store/slices/productsSlice';
import './PublishProduct.css';

const CATEGORIES = ['Electrónica', 'Ropa', 'Calzado', 'Accesorios', 'Hogar', 'Deportes', 'Libros', 'Juguetes', 'Otros'];

/**
 * Componente PublishProduct
 * Formulario para que un VENDEDOR publique un nuevo producto.
 * Usa el thunk publishProduct de productsSlice.
 * Solo accesible para usuarios con rol VENDEDOR.
 */
export default function PublishProduct() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(state => state.products);
  const { isAuthenticated, user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    titulo: '',
    description: '',
    category: '',
    urlImage: '',
    stock: '',
    price: '',
  });

  // Guardas de acceso
  if (!isAuthenticated) {
    return (
      <div className="publish-guard">
        <p>Debés iniciar sesión para publicar un producto.</p>
        <Link to="/login" className="guard-btn">Iniciar Sesión</Link>
      </div>
    );
  }

  if (user?.role !== 'VENDEDOR') {
    return (
      <div className="publish-guard">
        <p>Solo los vendedores pueden publicar productos.</p>
        <Link to="/become-seller" className="guard-btn">Convertirme en Vendedor</Link>
      </div>
    );
  }

  // Si se publicó con éxito, mostramos confirmación y redirigimos
  if (success) {
    return (
      <div className="publish-success-page">
        <div className="publish-success-card">
          <div className="success-icon">🎉</div>
          <h2>¡Producto publicado!</h2>
          <p>Tu producto ya está disponible en el catálogo de TPO Market.</p>
          <div className="success-actions">
            <button
              className="btn-publish-action primary"
              onClick={() => {
                dispatch(resetSuccess());
                setFormData({ titulo: '', description: '', category: '', urlImage: '', stock: '', price: '' });
              }}
            >
              Publicar otro producto
            </button>
            <button
              className="btn-publish-action secondary"
              onClick={() => { dispatch(resetSuccess()); navigate('/seller-dashboard'); }}
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(publishProduct({
      ...formData,
      stock: parseInt(formData.stock, 10),
      price: parseFloat(formData.price),
    }));
  };

  return (
    <div className="publish-page">
      <div className="publish-content">

        {/* Lado izquierdo */}
        <div className="publish-left">
          <Link to="/seller-dashboard" className="back-link">
            ← Volver al Dashboard
          </Link>
          <div className="publish-left-inner">
            <p className="publish-eyebrow">Nueva publicación</p>
            <h1 className="publish-headline">
              Publicá tu<br />producto
            </h1>
            <p className="publish-tagline">
              Completá el formulario y tu producto estará disponible para miles de compradores de forma inmediata.
            </p>
            <div className="publish-tips">
              <p className="tips-title">💡 Tips para vender más:</p>
              <ul>
                <li>Usá un título claro y descriptivo</li>
                <li>Incluí una imagen de buena calidad</li>
                <li>Describí el producto en detalle</li>
                <li>Fijá un precio competitivo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Lado derecho — formulario */}
        <div className="publish-right">
          <div className="publish-form-card">
            <form className="publish-form" onSubmit={handleSubmit}>

              <div className="form-group">
                <label className="form-label" htmlFor="titulo">Título del producto</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  className="form-input"
                  placeholder="Ej: Zapatillas Running Nike Air Max"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-input form-textarea"
                  placeholder="Describí tu producto: materiales, talle, color, condición..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="category">Categoría</label>
                  <select
                    id="category"
                    name="category"
                    className="form-input form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar...</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="stock">Stock disponible</label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    className="form-input"
                    placeholder="0"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">Precio (ARS)</label>
                <div className="price-input-wrapper">
                  <span className="price-prefix">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-input price-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="urlImage">URL de la imagen</label>
                <input
                  type="url"
                  id="urlImage"
                  name="urlImage"
                  className="form-input"
                  placeholder="https://..."
                  value={formData.urlImage}
                  onChange={handleChange}
                />
                {formData.urlImage && (
                  <div className="image-preview">
                    <img src={formData.urlImage} alt="Preview" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>

              {error && (
                <div className="publish-error">{error}</div>
              )}

              <div className="publish-form-actions">
                <button type="submit" className="btn-publish-submit" disabled={loading}>
                  {loading ? 'Publicando...' : 'Publicar Producto'}
                </button>
                <button
                  type="button"
                  className="btn-publish-cancel"
                  onClick={() => navigate('/seller-dashboard')}
                  disabled={loading}
                >
                  Cancelar
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
