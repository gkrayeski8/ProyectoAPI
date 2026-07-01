import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeFromCart, clearCart, checkoutCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

/**
 * Componente Cart
 * Muestra los elementos del carrito de compras del usuario y permite gestionarlo.
 * Utiliza Redux para acceder al estado global del carrito y de la sesión (auth).
 */
const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, loading, error } = useSelector((state) => state.cart); // Estado del carrito desde Redux
  const { isAuthenticated } = useSelector((state) => state.auth);              // Estado de autenticación

  // Carga el carrito desde el backend cada vez que el drawer se abre y el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated, isOpen]);

  // Maneja el proceso de pago: despacha el checkout y cierra el drawer si tiene éxito
  const handleCheckout = () => {
    const checkoutData = {
      metodoPago: "Tarjeta de Crédito",
      direccionEnvio: "Calle Falsa 123" // Datos hardcodeados por ahora
    };

    dispatch(checkoutCart(checkoutData)).then((result) => {
      if (!result.error) {
        alert('¡Compra realizada con éxito! Gracias por tu compra.');
        onClose();            // Cierra el drawer del carrito
        navigate('/products'); // Redirige al catálogo
      } else {
        alert('Hubo un error al procesar el checkout: ' + result.payload);
      }
    });
  };

  // Si el usuario no está autenticado, muestra un mensaje para que inicie sesión
  if (!isAuthenticated) {
    return (
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
        {/* stopPropagation evita que el clic en el drawer cierre el overlay */}
        <div className={`cart-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="cart-header">
            <h2>Mi Carrito</h2>
            <button className="cart-close-btn" onClick={onClose}>&times;</button>
          </div>
          <div className="cart-content empty">
            <p className="cart-message">Por favor, inicia sesión para ver tu carrito.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      {/* El drawer es el panel lateral deslizante */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Mi Carrito</h2>
          <button className="cart-close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <div className="cart-content">
          {/* Muestra spinner, error o la lista de items según el estado actual */}
          {loading ? (
            <p className="cart-message">Cargando carrito...</p>
          ) : error ? (
            <p className="cart-message error-msg">{error}</p>
          ) : !items || items.length === 0 ? (
            <p className="cart-message empty-msg">Tu carrito está vacío.</p>
          ) : (
            <>
              {/* Lista de productos en el carrito */}
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.productId} className="cart-item">
                    {/* Imagen del producto si existe */}
                    {item.urlImage && (
                      <div className="cart-item-image">
                        <img src={item.urlImage} alt={item.nameProduct} />
                      </div>
                    )}
                    {/* Datos del producto: nombre, precio unitario, cantidad y subtotal */}
                    <div className="cart-item-info">
                      <h4>{item.nameProduct}</h4>
                      <p>Precio Unitario: ${item.priceUnitario}</p>
                      <p>Cantidad: {item.quantity}</p>
                      <p><strong>Subtotal: ${item.subtotal}</strong></p>
                    </div>
                    <div className="cart-item-actions">
                      {/* Elimina solo este producto del carrito */}
                      <button 
                        onClick={() => dispatch(removeFromCart(item.productId))}
                        className="btn-remove"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {/* Resumen del total y botones de acción */}
              <div className="cart-summary">
                <div className="cart-total-row">
                  <span>Total</span>
                  <h3>${total?.toFixed(2)}</h3> {/* Muestra el total con 2 decimales */}
                </div>
                <div className="cart-actions">
                  <button onClick={() => dispatch(clearCart())} className="btn-clear">Vaciar</button>
                  <button onClick={handleCheckout} className="btn-checkout">Pagar</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
