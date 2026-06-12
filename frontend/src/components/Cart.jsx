import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeFromCart, clearCart } from '../store/slices/cartSlice';
import './Cart.css';

/**
 * Componente Cart
 * Muestra los elementos del carrito de compras del usuario y permite gestionarlo.
 * Utiliza Redux para acceder al estado global del carrito y de la sesión (auth).
 */
const Cart = () => {
  const dispatch = useDispatch(); // Hook para despachar acciones de Redux
  // Extraemos el estado del carrito (items, total, loading, error) del store
  const { items, total, loading, error } = useSelector((state) => state.cart);
  // Extraemos el token de autenticación para saber si el usuario está logueado
  const { token } = useSelector((state) => state.auth);

  // Efecto secundario que se ejecuta cuando el componente se monta o cuando cambia el token
  useEffect(() => {
    // Si hay un usuario autenticado (existe el token), solicitamos el carrito al backend
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  // Renderizado condicional si el usuario no está logueado
  if (!token) {
    return (
      <div className="cart-container">
        <h2>Mi Carrito</h2>
        <p>Por favor, inicia sesión para ver tu carrito.</p>
      </div>
    );
  }

  // Renderizado condicional si el carrito se está cargando o hubo un error
  if (loading) return <div className="cart-container"><p>Cargando carrito...</p></div>;
  if (error) return <div className="cart-container"><p className="error-msg">{error}</p></div>;

  return (
    <div className="cart-container">
      <h2>Mi Carrito</h2>
      {!items || items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-info">
                  <h4>Producto ID: {item.productId}</h4>
                  <p>Cantidad: {item.quantity}</p>
                  <p>Precio Unitario: ${item.price}</p>
                </div>
                <div className="cart-item-actions">
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
          <div className="cart-summary">
            <h3>Total: ${total?.toFixed(2)}</h3>
            <div className="cart-actions">
              <button onClick={() => dispatch(clearCart())} className="btn-clear">Vaciar Carrito</button>
              <button className="btn-checkout">Ir a Pagar</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
