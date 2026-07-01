import { createContext, useState, useContext, useEffect } from 'react';

// Creamos el contexto del tema; los componentes hijos lo consumen con useTheme()
const ThemeContext = createContext();

// Hook personalizado para acceder al contexto del tema desde cualquier componente
export const useTheme = () => useContext(ThemeContext);

// Proveedor del tema: envuelve la app y comparte isDarkMode y toggleTheme
export const ThemeProvider = ({ children }) => {
  // Inicializa el tema desde localStorage; si no hay nada guardado, usa oscuro por defecto
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Cada vez que cambia el tema, actualiza el atributo del HTML y lo persiste en localStorage
  useEffect(() => {
    const themeName = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName); // CSS vars reaccionan a este atributo
    localStorage.setItem('theme', themeName);                       // Persiste la preferencia del usuario
  }, [isDarkMode]);

  // Alterna entre oscuro y claro
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    // Expone isDarkMode y toggleTheme a todos los componentes hijos
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
