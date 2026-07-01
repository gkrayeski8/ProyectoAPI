import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import './ProductDetail.css';

// URL base de la API; se lee del .env o usa el valor por defecto en local
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Componente ProductDetail
 * Muestra la información detallada de un producto específico.
 * Obtiene el ID del producto desde la URL y realiza una petición al backend.
 */
export default function ProductDetail() {
  const { id } = useParams(); // Obtenemos el parámetro 'id' de la URL actual (ej: /products/42)
  const [product, setProduct] = useState(null);     // Datos del producto cargado desde el backend
  const [cargando, setCargando] = useState(true);   // true mientras se espera la respuesta del backend
  const [added, setAdded] = useState(false);         // Estado visual temporal del botón "Add to Cart"
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(state => state.auth); // Saber si el usuario tiene sesión activa
  const [buyLoading, setBuyLoading] = useState(false); // true mientras se procesa la compra directa

  // Efecto que se dispara al montar el componente o cuando cambia el ID en la URL
  useEffect(() => {
    // Solicitamos el detalle del producto a la API
    fetch(`${BASE_URL}/publications/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Product no encontrado');
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);     // Guardamos el producto en el estado local
        setCargando(false);   // Terminamos la carga exitosamente
      })
      .catch((error) => {
        console.error("Error al traer el detalle:", error);
        setCargando(false); // También desactivamos el loading si hay un error
      });
  }, [id]); // Se re-ejecuta cada vez que cambia el ID del producto en la URL

  // Muestra un indicador de carga mientras se espera la respuesta del backend
  if (cargando) {
    return <div className="loading-container"><h3>Loading product details...</h3></div>;
  }

  // Muestra un error si el producto no existe o la petición falló
  if (!product) {
    return (
      <div className="error-container">
        <h3>Product not found or an error occurred.</h3>
        <Link to="/products" className="btn btn-outline">Back to Shop</Link>
      </div>
    );
  }

  // Extraemos y normalizamos las propiedades del producto (soporta distintos formatos de respuesta)
  const img = product.urlImage || product.image || '';
  const title = product.titulo || product.name || 'Untitled Product';
  const price = product.price || 0;
  const description = product.description || 'No description available.';
  const category = product.category || 'General';
  const stock = product.stock ?? 0;

  // Agrega el producto al carrito; redirige al login si no hay sesión activa
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (stock > 0) {
      dispatch(addToCart({ productId: product.id, quantity: 1 }));
      setAdded(true); // Cambia el texto del botón temporalmente
      setTimeout(() => setAdded(false), 2000); // Restaura el botón tras 2 segundos
    }
  };

  // Compra directa del producto sin pasar por el carrito
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (stock <= 0) return; // No hacemos nada si no hay stock
    
    setBuyLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/sales/direct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Envía la cookie de sesión para autenticar
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          metodoPago: 'Tarjeta de Crédito',
          direccionEnvio: 'Mi Dirección 123' // Valores hardcodeados por ahora
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al realizar la compra');
      }
      
      alert('¡La compra ha sido realizada con éxito!');
      
      // Actualizar el stock local para reflejar la venta sin necesidad de recargar
      setProduct(prev => ({ ...prev, stock: prev.stock - 1 }));
    } catch (error) {
      console.error(error);
      alert('Hubo un problema procesando tu compra.');
    } finally {
      setBuyLoading(false); // Siempre desactivamos el loading al terminar
    }
  };

  return (
    <div className="detail-page">
      <div className="detail-split">
        {/* Columna izquierda: imagen del producto */}
        <div className="detail-image-side">
          {img ? (
            <img src={img} alt={title} />
          ) : (
            <div className="no-image-placeholder">No Image Available</div>
          )}
        </div>
        
        {/* Columna derecha: información y acciones del producto */}
        <div className="detail-info-side">
          <Link to="/products" className="back-link">&larr; Back to Shop</Link>
          
          <div className="category-tag">{category}</div>
          <h1 className="detail-title">{title}</h1>
          <p className="detail-price">${Number(price).toLocaleString('es-AR')}</p> {/* Precio formateado */}
          
          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Availability</span>
              {/* Muestra la cantidad en stock o "Out of stock" */}
              <span className="meta-value">{stock > 0 ? `${stock} in stock` : 'Out of stock'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Shipping</span>
              <span className="meta-value">Free standard</span>
            </div>
          </div>

          <p className="detail-description">{description}</p>
          
          <div className="detail-actions">
            {/* Botón para agregar al carrito; deshabilitado si no hay stock o ya fue agregado */}
            <button 
              className="add-to-cart-btn" 
              onClick={handleAddToCart}
              disabled={stock <= 0 || added}
            >
              {added ? 'Agregado ✓' : (stock > 0 ? 'Add to Cart' : 'Sin Stock')}
            </button>
            {/* Botón de compra directa; muestra spinner mientras se procesa */}
            <button 
              className="buy-now-btn" 
              onClick={handleBuyNow}
              disabled={stock <= 0 || buyLoading}
            >
              {buyLoading ? 'Procesando...' : 'Comprar ahora'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}