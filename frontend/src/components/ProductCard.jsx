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
            {img && <img src={img} alt={name} className="product-image" />}
            <h3 className="product-name">{name}</h3>
            <p className="product-price">
                ${Number(price).toLocaleString('es-AR')}
            </p>
            <p className="product-description">{description}</p>
            <span className="view-detail">Ver detalle →</span>
        </div>
    );
};

export default ProductCard;