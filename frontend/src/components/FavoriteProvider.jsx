import { createContext, useState, useContext } from "react";

const FavoriteContext = createContext();

export const useFavorites = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    const addFavorite = (product) => {
        if (!favorites.find(fav => fav.id === product.id)) {
            setFavorites([...favorites, product]);
        }
    };

    const removeFavorite = (productId) => {
        setFavorites(favorites.filter(fav => fav.id !== productId));
    };

    return (
        <FavoriteContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
            {children}
        </FavoriteContext.Provider>
    );
};
