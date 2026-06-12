import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';
import imgNotFound from '../assets/images/no-image.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { addFavoriteAsync, deleteFavoriteAsync } from '../store/slices/favoritesSlice';


/**
 * Componente ProductCard
 * Renderiza una tarjeta individual de producto mostrando su imagen, título, precio.
 * Permite agregar o eliminar el producto de los favoritos utilizando Redux.
 */
const ProductCard = ({ product }) => {

    // Obtenemos los items favoritos del store para comprobar si este producto ya es favorito
    const favorites = useSelector(state => state.favorites.items);
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const dispatch = useDispatch(); // Hook para despachar acciones (agregar/eliminar favoritos)
    const navigate = useNavigate();

    // Normalización de las propiedades del producto para soportar diferentes formatos de API
    const id = product.id ?? product.codigo;
    const name = product.titulo ?? product.name ?? 'Sin name';
    const price = product.price ?? 0;
    const img = product.urlImage ?? product.image ?? '';
    const description = product.description ?? '';
    
    // Verificamos si este producto en particular se encuentra en la lista global de favoritos
    const isFavorite = favorites.some(fav => fav.id === id);

    return (
        <div className="product-card">
            <div className="image-container">
                {img ? (
                    <img
                        src={img}
                        alt={name}
                        className="product-image"
                        onError={(e) => { e.target.src = imgNotFound }}
                    />
                ) : (
                    <img src={imgNotFound} alt="No image" className="product-image" />
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-price">
                    ${Number(price).toLocaleString('es-AR')}
                </p>
                {/* Botón para alternar estado de favorito, interceptando el evento click para evitar navegar al detalle */}
                <button className="favorite-btn" onClick={(e) => {
                    e.preventDefault(); // Prevenimos la navegación al link padre

                    if (!isAuthenticated) {
                        navigate('/login');
                        return;
                    }

                    // Despachamos la acción asíncrona correspondiente dependiendo de si es favorito o no
                    if (isFavorite) {
                        dispatch(deleteFavoriteAsync(product)); // Tu nuevo thunk espera el product completo para sacar el ID
                    } else {
                        dispatch(addFavoriteAsync(product));
                    }
                }}>
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