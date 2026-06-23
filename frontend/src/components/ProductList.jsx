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
    const searchQuery = searchParams.get('search') || '';
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Efecto para cargar products cada vez que cambia la categoría seleccionada o el término de búsqueda
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedCategory) params.append('category', selectedCategory);
                if (searchQuery) params.append('search', searchQuery);

                const queryString = params.toString();
                const url = queryString 
                    ? `${BASE_URL}/publications?${queryString}` 
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
    }, [selectedCategory, searchQuery]);

    // Eliminado el return temprano para que la barra lateral (sidebar) no desaparezca al cargar

    // Normalizamos el formato de la lista de productos, ya que la API
    // puede devolver un array directo o un objeto con distintas propiedades
    const items = Array.isArray(products)
        ? products
        : products?.products || products?.data || products?.items || [];

    const getTitleText = () => {
        if (selectedCategory && searchQuery) {
            return `Resultados de "${searchQuery}" en ${selectedCategory}`;
        }
        if (selectedCategory) {
            return `Explorando: ${selectedCategory}`;
        }
        if (searchQuery) {
            return `Resultados de: "${searchQuery}"`;
        }
        return 'Marketplace Explorer';
    };

    return (
        <div className="product-page">
            <div className="product-list-container">
                <h1 className="product-list-title">
                    {getTitleText()}
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