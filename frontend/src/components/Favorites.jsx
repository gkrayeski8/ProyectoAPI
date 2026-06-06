import React from 'react';
import { useFavorites } from './FavoriteProvider.jsx';
import ProductCard from './ProductCard';

const Favorites = () => {
    const { favorites } = useFavorites();

    return (
        <div style={{ padding: '2rem' }}>
            <h1>Mis Favoritos</h1>
            {favorites.length === 0 ? (
                <p>Aún no tienes products favoritos.</p>
            ) : (
                <div className="product-grid">
                    {favorites.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
