import React from 'react';
import './ProductCard.css';
import imgNotFound from '../assets/images/no-image.jpg';
import { useFavorites } from './FavoriteProvider';


const ProductCard = ({ producto }) => {

    const { favorites, addFavorite, removeFavorite } = useFavorites();

    const id = producto.id ?? producto.codigo;
    const name = producto.titulo ?? producto.nombre ?? 'Sin nombre';
    const price = producto.precio ?? 0;
    const img = producto.urlImagen ?? producto.imagen ?? '';
    const description = producto.descripcion ?? '';
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
                <button className="favorite-btn" onClick={(e) => {
                    e.preventDefault();

                    if (isFavorite) {
                        removeFavorite(producto.id);
                    } else {
                        addFavorite(producto);
                    }
                }}>
                    {isFavorite ? '❤️Eliminar' : '🤍Agregar'}
                </button>
                <span className="view-detail">View Details &rarr;</span>
            </div>
        </div>
    );
};

export default ProductCard;