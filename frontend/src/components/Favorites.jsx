import React from 'react';
import { useSelector } from 'react-redux';
import ProductCard from './ProductCard';
import './Favorites.css';

/**
 * Componente Favorites
 * Panel lateral (drawer) que muestra los productos favoritos del usuario.
 * Utiliza Redux para leer la lista de favoritos y el estado de autenticación.
 */
const Favorites = ({ isOpen, onClose }) => {
    const favorites = useSelector((state) => state.favorites.items); // Lista de favoritos del store
    const { isAuthenticated } = useSelector((state) => state.auth);  // Estado de autenticación

    // Si el usuario no está logueado, mostramos un mensaje en lugar de los favoritos
    if (!isAuthenticated) {
        return (
            // El overlay se oscurece cuando el drawer está abierto; clic fuera lo cierra
            <div className={`fav-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
                {/* stopPropagation evita que el clic dentro del drawer cierre el overlay */}
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
                    {/* Muestra un mensaje si la lista está vacía, o las tarjetas de productos */}
                    {favorites.length === 0 ? (
                        <p className="fav-message">Aún no tienes productos favoritos.</p>
                    ) : (
                        <div className="fav-items">
                            {/* Renderiza una ProductCard por cada favorito guardado */}
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
