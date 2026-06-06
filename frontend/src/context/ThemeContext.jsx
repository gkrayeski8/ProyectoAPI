import React, { createContext, useState, useEffect } from 'react';

// 1. Creamos el contexto
export const ThemeContext = createContext();

// 2. Creamos el Provider
export const ThemeProvider = ({ children }) => {
    // Inicializamos el estado, leyendo de localStorage si existe, o por defecto 'light'
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return savedTheme ? savedTheme : 'light';
    });

    // Efecto para aplicar el tema al documento (HTML) cuando cambie
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    // Función para alternar el tema
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    // Proveemos el estado y la función a los hijos
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
