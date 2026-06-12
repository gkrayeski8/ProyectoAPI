import React from 'react';
import './ProductCard.css';
import imgNotFound from '../assets/images/no-image.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';


/**
 * Componente ProductCard
 * Renderiza una tarjeta individual de producto mostrando su imagen, título, precio.
 * Permite agregar o eliminar el producto de los favoritos utilizando Redux.
 */
const ProductCard = ({ product }) => {

    // Obtenemos los items favoritos del store para comprobar si este producto ya es favorito
    const favorites = useSelector(state => state.favorites.items);
    const dispatch = useDispatch(); // Hook para despachar acciones (agregar/eliminar favoritos)

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

                    // Despachamos la acción correspondiente dependiendo de si es favorito o no
                    if (isFavorite) {
                        dispatch(removeFavorite(product.id));
                    } else {
                        dispatch(addFavorite(product));
                    }
                }}>
                    {isFavorite ? '❤️Delete' : '🤍Add'}
                </button>
                <span className="view-detail">View Details &rarr;</span>
            </div>
        </div>
    );
};

export default ProductCard;