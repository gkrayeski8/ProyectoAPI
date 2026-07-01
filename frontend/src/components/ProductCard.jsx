import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import imgNotFound from '../assets/images/no-image.jpg'; // Imagen de fallback si el producto no tiene foto
import { useSelector, useDispatch } from 'react-redux';
import { addFavoriteAsync, deleteFavoriteAsync } from '../store/slices/favoritesSlice';
import { addToCart } from '../store/slices/cartSlice';


/**
 * Componente ProductCard
 * Renderiza una tarjeta individual de producto mostrando su imagen, título, precio.
 * Permite agregar o eliminar el producto de los favoritos utilizando Redux.
 */
const ProductCard = ({ product }) => {

    const [added, setAdded] = useState(false); // Estado visual temporal: muestra "Added ✅" tras agregar al carrito

    // Obtenemos los items favoritos del store para comprobar si este producto ya es favorito
    const favorites = useSelector(state => state.favorites.items);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated); // Saber si el usuario está logueado
    const dispatch = useDispatch(); // Hook para despachar acciones (agregar/eliminar favoritos)
    const navigate = useNavigate();

    // Normalización de las propiedades del producto para soportar diferentes formatos de API
    const id = product.id ?? product.codigo;
    const name = product.titulo ?? product.name ?? 'Sin name';
    const price = product.price ?? 0;
    const img = product.urlImage ?? product.image ?? '';
    const stock = product.stock ?? 1; // Por defecto asumimos que hay stock si no viene en el objeto
    
    // Verificamos si este producto en particular se encuentra en la lista global de favoritos
    const isFavorite = favorites.some(fav => fav.id === id);

    // Maneja el clic en el botón "Agregar al carrito"
    const handleAddToCart = (e) => {
        e.preventDefault(); // Prevenimos la navegación al link padre

        if (!isAuthenticated) {
            navigate('/login'); // Redirigimos al login si no tiene sesión
            return;
        }

        if (stock > 0) {
            dispatch(addToCart({ productId: id, quantity: 1 }));
            setAdded(true); // Activa el estado visual de "añadido"
            setTimeout(() => setAdded(false), 2000); // Vuelve al estado normal tras 2 segundos
        }
    };

    return (
        <div className="product-card">
            <div className="image-container">
                {/* Muestra la imagen del producto o el placeholder si no hay una */}
                {img ? (
                    <img
                        src={img}
                        alt={name}
                        className="product-image"
                        onError={(e) => { e.target.src = imgNotFound }} // Si falla la carga, usa el fallback
                    />
                ) : (
                    <img src={imgNotFound} alt="No image" className="product-image" />
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-price">
                    ${Number(price).toLocaleString('es-AR')} {/* Formatea el precio con separador de miles argentino */}
                </p>
                {/* Botón para agregar directamente al carrito */}
                <button 
                    className="cart-btn" 
                    onClick={handleAddToCart}
                    disabled={stock <= 0 || added} // Deshabilitado si no hay stock o si acaba de agregar
                >
                    {/* Texto e ícono del botón según el estado actual */}
                    {added ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <span>✅</span>
                            <span>Added</span>
                        </div>
                    ) : stock <= 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <span>🚫</span>
                            <span>No Stock</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <span>🛒</span>
                            <span>Add</span>
                        </div>
                    )}
                </button>
                {/* Botón para alternar estado de favorito, interceptando el evento click para evitar navegar al detalle */}
                <button className="favorite-btn" onClick={(e) => {
                    e.preventDefault(); // Prevenimos la navegación al link padre

                    if (!isAuthenticated) {
                        navigate('/login'); // Redirigimos al login si no tiene sesión
                        return;
                    }

                    // Despachamos la acción asíncrona correspondiente dependiendo de si es favorito o no
                    if (isFavorite) {
                        dispatch(deleteFavoriteAsync(product)); // Tu nuevo thunk espera el product completo para sacar el ID
                    } else {
                        dispatch(addFavoriteAsync(product));
                    }
                }}>
                    {/* Ícono de corazón: relleno si es favorito, contorno si no lo es */}
                    {isFavorite ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff4757" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>Delete</span>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                            <span>Add</span>
                        </div>
                    )}
                </button>
                <span className="view-detail">View Details &rarr;</span>
            </div>
        </div>
    );
};

export default ProductCard;