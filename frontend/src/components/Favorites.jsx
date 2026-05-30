import React from 'react';
import { useFavorites } from './FavoriteProvider';
import ProductCard from './ProductCard';

const Favorites = () => {
    const { favorites } = useFavorites();

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Mis Favoritos</h1>
            {favorites.length === 0 ? (
                <p>Aún no tienes productos favoritos.</p>
            ) : (
                <div className="product-grid">
                    {favorites.map(producto => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
