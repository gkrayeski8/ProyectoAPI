import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/publicationes/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Product no encontrado');
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al traer el detalle:", error);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return <div className="loading-container"><h3>Loading product details...</h3></div>;
  }

  if (!product) {
    return (
      <div className="error-container">
        <h3>Product not found or an error occurred.</h3>
        <Link to="/products" className="btn btn-outline">Back to Shop</Link>
      </div>
    );
  }

  const img = product.urlImage || product.image || '';
  const title = product.titulo || product.name || 'Untitled Product';
  const price = product.price || 0;
  const description = product.description || 'No description available.';
  const category = product.category || 'General';
  const stock = product.stock ?? 0;

  return (
    <div className="detail-page">
      <div className="detail-split">
        <div className="detail-image-side">
          {img ? (
            <img src={img} alt={title} />
          ) : (
            <div className="no-image-placeholder">No Image Available</div>
          )}
        </div>
        
        <div className="detail-info-side">
          <Link to="/products" className="back-link">&larr; Back to Shop</Link>
          
          <div className="category-tag">{category}</div>
          <h1 className="detail-title">{title}</h1>
          <p className="detail-price">${Number(price).toLocaleString('es-AR')}</p>
          
          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Availability</span>
              <span className="meta-value">{stock > 0 ? `${stock} in stock` : 'Out of stock'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Shipping</span>
              <span className="meta-value">Free standard</span>
            </div>
          </div>

          <p className="detail-description">{description}</p>
          
          <button className="add-to-cart-btn">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}