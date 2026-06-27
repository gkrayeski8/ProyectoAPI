import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import './Favorites.css';

const Favorites = ({ isOpen, onClose }) => {
    const favorites = useSelector((state) => state.favorites.items);
    const { isAuthenticated } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return (
            <div className={`fav-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
                <div className={`fav-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                    <div className="fav-header">
                        <h2>Mis Favoritos</h2>
                        <button className="fav-close-btn" onClick={onClose}>&times;</button>
                    </div>
                    <div className="fav-content">
                        <p className="fav-message">Por favor, inicia sesión para ver tus favoritos.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`fav-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
            <div className={`fav-drawer ${isOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className="fav-header">
                    <h2>Mis Favoritos</h2>
                    <button className="fav-close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="fav-content">
                    {favorites.length === 0 ? (
                        <p className="fav-message">Aún no tienes productos favoritos.</p>
                    ) : (
                        <div className="fav-items">
                            {favorites.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Favorites;
