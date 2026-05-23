import React, { useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // `useEffect` se ejecuta una sola vez al montar el componente.
    // Aquí iniciamos la carga de productos desde la API.
    // pasar `[]` como segundo argumento hace que el efecto se ejecute sólo al montar
    useEffect(() => {
        // `fetchProducts` es una función `async` que realiza la petición HTTP.
        // - `async/await` permite escribir código asíncrono secuencialmente.
        // - `try` intenta la petición y parseo JSON; `catch` maneja errores de red/CORS.
        // - `finally` garantiza que la UI deje de mostrar el estado de carga.
        const fetchProducts = async () => {
            try {
                // Asegurate de que el backend esté corriendo en el puerto 8080
                const response = await fetch('http://localhost:8080/api/publicaciones');
                if (!response.ok) {
                    throw new Error('Error al cargar los productos');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                // Mostrar el error (o usar datos locales como fallback en ejercicios)
                setError(err.message);
            } finally {
                // Siempre desactivar el loading, haya ocurrido error o no.
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Cargando productos...</div>;
    if (error) return <div>Error: {error}</div>;

    // Normalizar posibles formas de respuesta: array directo o { productos: [...] } u objetos comunes
    const items = Array.isArray(products)
        ? products
        : products?.productos || products?.data || products?.items || [];

    return (
        <div className="product-list-container">
            <h1 className="product-list-title">Lista de Productos</h1>
            <div className="product-grid">
                {items.length === 0 && <div>No hay productos disponibles.</div>}

                {items.map(p => (
                    <Link
                        to={`/products/${p.id}`}
                        key={p.id}
                        className="product-card-link"
                    >
                        {/* Pasamos el objeto 'p' como la prop 'producto' */}
                        <ProductCard producto={p} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductList;