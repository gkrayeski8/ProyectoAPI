import React from 'react';
import './ProductCard.css';

/**
 * Componente atómico para representar un producto individual.
 * Recibe el objeto 'producto' como prop.
 */
const ProductCard = ({ producto }) => {
    // Desestructuramos para un código más limpio
    const id = producto.id ?? producto.codigo;
    const name = producto.titulo ?? producto.nombre ?? 'Sin nombre';
    const price = producto.precio ?? 0;
    const img = producto.urlImagen ?? producto.imagen ?? '';
    const description = producto.descripcion ?? '';

    return (
        <div className="product-card">
            <div className="image-container">
                {img ? (
                    <img src={img} alt={name} className="product-image" />
                ) : (
                    <div className="product-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        No Image
                    </div>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-name">{name}</h3>
                <p className="product-price">
                    ${Number(price).toLocaleString('es-AR')}
                </p>
                <span className="view-detail">View Details &rarr;</span>
            </div>
        </div>
    );
};

export default ProductCard;