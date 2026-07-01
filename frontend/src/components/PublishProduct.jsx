import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { publishProduct, resetSuccess } from '../store/slices/productsSlice';
import './PublishProduct.css';

// Lista fija de categorías disponibles para seleccionar en el formulario
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
  const { loading, error, success } = useSelector(state => state.products); // Estado de la publicación
  const { isAuthenticated, user } = useSelector(state => state.auth);        // Datos de la sesión

  // Estado local del formulario con los campos del producto
  const [formData, setFormData] = useState({
    titulo: '',
    description: '',
    category: '',
    urlImage: '',
    stock: '',
    price: '',
  });

  // Guarda de acceso: si no está logueado, pide que inicie sesión
  if (!isAuthenticated) {
    return (
      <div className="publish-guard">
        <p>Debés iniciar sesión para publicar un producto.</p>
        <Link to="/login" className="guard-btn">Iniciar Sesión</Link>
      </div>
    );
  }

  // Guarda de acceso: solo los vendedores pueden publicar productos
  if (user?.role !== 'VENDEDOR') {
    return (
      <div className="publish-guard">
        <p>Solo los vendedores pueden publicar productos.</p>
        <Link to="/become-seller" className="guard-btn">Convertirme en Vendedor</Link>
      </div>
    );
  }

  // Si se publicó con éxito, mostramos una pantalla de confirmación con opciones
  if (success) {
    return (
      <div className="publish-success-page">
        <div className="publish-success-card">
          <div className="success-icon">🎉</div>
          <h2>¡Producto publicado!</h2>
          <p>Tu producto ya está disponible en el catálogo de TPO Market.</p>
          <div className="success-actions">
            {/* Resetea el formulario para publicar otro producto */}
            <button
              className="btn-publish-action primary"
              onClick={() => {
                dispatch(resetSuccess()); // Limpia el flag de éxito en Redux
                setFormData({ titulo: '', description: '', category: '', urlImage: '', stock: '', price: '' });
              }}
            >
              Publicar otro producto
            </button>
            {/* Navega al dashboard del vendedor */}
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

  // Actualiza el campo correspondiente en el estado del formulario cuando el usuario escribe
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Despacha el thunk de publicación convirtiendo stock y price a sus tipos numéricos correctos
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto del formulario
    dispatch(publishProduct({
      ...formData,
      stock: parseInt(formData.stock, 10),  // Convierte el stock a entero
      price: parseFloat(formData.price),    // Convierte el precio a decimal
    }));
  };

  return (
    <div className="publish-page">
      <div className="publish-content">

        {/* Lado izquierdo: info y tips de venta */}
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
            {/* Lista de consejos para mejorar las ventas */}
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

        {/* Lado derecho: formulario de publicación */}
        <div className="publish-right">
          <div className="publish-form-card">
            <form className="publish-form" onSubmit={handleSubmit}>

              {/* Campo de título del producto */}
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

              {/* Campo de descripción (textarea para textos más largos) */}
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

              {/* Fila con dos campos: categoría y stock */}
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
                    {/* Genera una opción por cada categoría definida en la constante CATEGORIES */}
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
                    min="0" // No permite valores negativos
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Campo de precio con prefijo "$" visual */}
              <div className="form-group">
                <label className="form-label" htmlFor="price">Precio (ARS)</label>
                <div className="price-input-wrapper">
                  <span className="price-prefix">$</span> {/* Símbolo decorativo del peso */}
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="form-input price-input"
                    placeholder="0.00"
                    min="0"
                    step="0.01" // Permite precios con decimales
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Campo de URL de imagen con preview en tiempo real */}
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
                {/* Preview de la imagen si el campo tiene valor */}
                {formData.urlImage && (
                  <div className="image-preview">
                    <img src={formData.urlImage} alt="Preview" onError={e => e.target.style.display = 'none'} />
                  </div>
                )}
              </div>

              {/* Muestra el error si la publicación falla */}
              {error && (
                <div className="publish-error">{error}</div>
              )}

              {/* Botones de submit y cancelar */}
              <div className="publish-form-actions">
                <button type="submit" className="btn-publish-submit" disabled={loading}>
                  {loading ? 'Publicando...' : 'Publicar Producto'}
                </button>
                <button
                  type="button"
                  className="btn-publish-cancel"
                  onClick={() => navigate('/seller-dashboard')} // Vuelve al dashboard sin publicar
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
