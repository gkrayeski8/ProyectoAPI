import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar categorías al montar
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/publicationes/categorys');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (err) {
                console.error("Error al cargar categorías", err);
            }
        };
        fetchCategories();
    }, []);

    // Cargar products cada vez que cambia la categoría seleccionada
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const url = selectedCategory
                    ? `http://localhost:8080/api/publicationes?category=${encodeURIComponent(selectedCategory)}`
                    : 'http://localhost:8080/api/publicationes';

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

    const items = Array.isArray(products)
        ? products
        : products?.products || products?.data || products?.items || [];

    return (
        <div className="product-page">
            <aside className="sidebar">
                <h2 className="sidebar-title">Categorías</h2>
                <ul className="category-list">
                    <li
                        className={`category-item ${selectedCategory === '' ? 'active' : ''}`}
                        onClick={() => setSelectedCategory('')}
                    >
                        Todas las categorías
                    </li>
                    {categories.map(cat => (
                        <li
                            key={cat}
                            className={`category-item ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
            </aside>
            <div className="product-list-container">
                <h1 className="product-list-title">Marketplace Explorer</h1>

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