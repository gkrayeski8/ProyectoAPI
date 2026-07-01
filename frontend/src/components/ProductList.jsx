import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductList.css';

// URL base de la API; se lee del .env o usa el valor por defecto en local
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

/**
 * Componente ProductList
 * Muestra la lista de productos disponibles en el marketplace y una barra lateral
 * para filtrar los productos por categoría.
 */
const ProductList = () => {
    const [products, setProducts] = useState([]);          // Lista de productos obtenida del backend
    const [searchParams] = useSearchParams();              // Lee los parámetros de la URL (category, search)
    const selectedCategory = searchParams.get('category') || ''; // Categoría seleccionada desde la URL
    const searchQuery = searchParams.get('search') || '';         // Término de búsqueda desde la URL
    const [loading, setLoading] = useState(true);          // true mientras se cargan los productos
    const [error, setError] = useState(null);              // Mensaje de error si la petición falla

    // Efecto para cargar products cada vez que cambia la categoría seleccionada o el término de búsqueda
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                // Solo agrega los parámetros si tienen valor
                if (selectedCategory) params.append('category', selectedCategory);
                if (searchQuery) params.append('search', searchQuery);

                // Construye la URL con o sin query string según los filtros activos
                const queryString = params.toString();
                const url = queryString 
                    ? `${BASE_URL}/publications?${queryString}` 
                    : `${BASE_URL}/publications`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Error al cargar los products');
                }
                const data = await response.json();
                setProducts(data); // Guarda los productos recibidos en el estado local
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false); // Siempre desactivamos el loading al terminar
            }
        };

        fetchProducts();
    }, [selectedCategory, searchQuery]); // Se re-ejecuta cuando cambian los filtros

    // Eliminado el return temprano para que la barra lateral (sidebar) no desaparezca al cargar

    // Normalizamos el formato de la lista de productos, ya que la API
    // puede devolver un array directo o un objeto con distintas propiedades
    const items = Array.isArray(products)
        ? products
        : products?.products || products?.data || products?.items || [];

    // Genera el título dinámico según los filtros activos
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
        return 'Marketplace Explorer'; // Título por defecto sin filtros
    };

    return (
        <div className="product-page">
            <div className="product-list-container">
                <h1 className="product-list-title">
                    {getTitleText()}
                </h1>

                {/* Muestra spinner durante la carga, error si falló, o la grilla de productos */}
                {loading ? (
                    <div className="spinner-container"><div className='spinner'></div></div>
                ) : error ? (
                    <div className="error">Error: {error}</div>
                ) : (
                    <div className="product-grid">
                        {/* Mensaje si no hay productos para mostrar */}
                        {items.length === 0 && <div>No hay products disponibles.</div>}

                        {/* Renderiza una tarjeta por cada producto; cada una es un link al detalle */}
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