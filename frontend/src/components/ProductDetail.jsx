import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ProductDetail.css';

export default function ProductDetail() {
  // useParams captura el ':id' de la URL automáticamente
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/publicaciones/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Producto no encontrado');
        }
        return response.json();
      })
      .then((data) => {
        setProducto(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al traer el detalle:", error);
        setCargando(false);
      });
  }, [id]); // Si el ID cambia por alguna razón, se vuelve a disparar el efecto

  if (cargando) {
    return <div className="container"><h3>Cargando producto...</h3></div>;
  }

  if (!producto) {
    return (
      <div className="container">
        <h3>El producto no existe o hubo un error.</h3>
        <Link to="/" className="nav-btn">Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container detail-container glass">
      <Link to="/products" className="back-link">← Volver al catálogo</Link>
      
      <div className="detail-content">
        <div className="detail-image">
          {/* Si no tenés imágenes en la DB, podés usar un placeholder */}
          <img src={producto.urlImagen || 'https://via.placeholder.com/400'} alt={producto.titulo || producto.nombre || 'Producto'} />
        </div>
        
        <div className="detail-info">
          <h1>{producto.titulo || producto.nombre}</h1>
          <p className="category">Categoría: {producto.categoria || 'General'}</p>
          <p className="description">{producto.descripcion || 'Sin descripción disponible.'}</p>
          <p className="price">${producto.precio}</p>
          <p className="stock">Stock disponible: {producto.stock} unidades</p>
          
          <button className="add-to-cart-btn">
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}