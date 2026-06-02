import React from 'react';
import './ProductCard.css';
import imgNotFound from '../assets/images/no-image.jpg';
import { useFavorites } from './FavoriteProvider';


const ProductCard = ({ product }) => {

    const { favorites, addFavorite, removeFavorite } = useFavorites();

    const id = product.id ?? product.codigo;
    const name = product.titulo ?? product.name ?? 'Sin name';
    const price = product.price ?? 0;
    const img = product.urlImage ?? product.image ?? '';
    const description = product.description ?? '';
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
                        removeFavorite(product.id);
                    } else {
                        addFavorite(product);
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