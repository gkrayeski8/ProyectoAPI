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
const Cart = () => {
  const dispatch = useDispatch(); // Hook para despachar acciones de Redux
  const navigate = useNavigate();
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

  const handleCheckout = () => {
    // Por el momento se envían datos mockeados ya que no hay un formulario completo
    const checkoutData = {
      metodoPago: "Tarjeta de Crédito",
      direccionEnvio: "Calle Falsa 123"
    };

    dispatch(checkoutCart(checkoutData)).then((result) => {
      if (!result.error) {
        alert('¡Compra realizada con éxito! Gracias por tu compra.');
        navigate('/');
      } else {
        alert('Hubo un error al procesar el checkout: ' + result.payload);
      }
    });
  };

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
                {item.urlImage && (
                  <div className="cart-item-image">
                    <img src={item.urlImage} alt={item.nameProduct} />
                  </div>
                )}
                <div className="cart-item-info">
                  <h4>{item.nameProduct}</h4>
                  <p>Precio Unitario: ${item.priceUnitario}</p>
                  <p>Cantidad: {item.quantity}</p>
                  <p><strong>Subtotal: ${item.subtotal}</strong></p>
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
              <button onClick={handleCheckout} className="btn-checkout">Ir a Pagar</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
