import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeFromCart, clearCart } from '../store/slices/cartSlice';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, total, loading, error } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  if (!token) {
    return (
      <div className="cart-container">
        <h2>Mi Carrito</h2>
        <p>Por favor, inicia sesión para ver tu carrito.</p>
      </div>
    );
  }

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
