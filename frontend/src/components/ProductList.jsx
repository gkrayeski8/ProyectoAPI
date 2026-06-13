import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductList.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Componente ProductList
 * Muestra la lista de productos disponibles en el marketplace y una barra lateral
 * para filtrar los productos por categoría.
 */
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') || '';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Efecto para cargar products cada vez que cambia la categoría seleccionada en la barra lateral
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = selectedCategory
                    ? `${BASE_URL}/publications?category=${encodeURIComponent(selectedCategory)}`
                    : `${BASE_URL}/publications`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Error al cargar los products');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    // Eliminado el return temprano para que la barra lateral (sidebar) no desaparezca al cargar

    // Normalizamos el formato de la lista de productos, ya que la API
    // puede devolver un array directo o un objeto con distintas propiedades
    const items = Array.isArray(products)
        ? products
        : products?.products || products?.data || products?.items || [];

    return (
        <div className="product-page">
            <div className="product-list-container">
                <h1 className="product-list-title">
                    {selectedCategory ? `Explorando: ${selectedCategory}` : 'Marketplace Explorer'}
                </h1>

                {loading ? (
                    <div className="spinner-container"><div className='spinner'></div></div>
                ) : error ? (
                    <div className="error">Error: {error}</div>
                ) : (
                    <div className="product-grid">
                        {items.length === 0 && <div>No hay products disponibles.</div>}

                        {items.map(p => (
                            <Link
                                to={`/products/${p.id}`}
                                key={p.id}
                                className="product-card-link"
                            >
                                <ProductCard product={p} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;