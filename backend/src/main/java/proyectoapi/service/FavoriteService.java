package proyectoapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import proyectoapi.dto.MessageResponseDTO;
import proyectoapi.model.Favorite;
import proyectoapi.model.Product;
import proyectoapi.model.User;
import proyectoapi.repository.FavoriteRepository;
import proyectoapi.repository.ProductRepository;
import proyectoapi.repository.UserRepository;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public MessageResponseDTO clearFavorites(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) throw new RuntimeException("Usuario no encontrado");
        favoriteRepository.deleteByUser(user);
        return new MessageResponseDTO("Favorites cleared successfully");
    }

    @Transactional
    public MessageResponseDTO addFavorite(Long productId, String email) {
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) throw new RuntimeException("Usuario no encontrado");
            
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + productId));

            if (favoriteRepository.existsByUserAndProduct(user, product)) {
                throw new RuntimeException("El producto ya está en tus favoritos.");
            }

            Favorite favorite = new Favorite(user, product);
            favoriteRepository.save(favorite);

            return new MessageResponseDTO("Producto agregado a favoritos correctamente.");

        } catch (Exception e) {
            throw new RuntimeException("Error al agregar a favoritos: " + e.getMessage());
        }
    }

    @Transactional
    public MessageResponseDTO removeFavorite(Long productId, String email) {
        try {
            User user = userRepository.findByEmail(email);
            if (user == null) throw new RuntimeException("Usuario no encontrado");
            
            favoriteRepository.deleteByUserAndProduct_Id(user, productId);
            return new MessageResponseDTO("Producto eliminado de favoritos.");
        } catch (Exception e) {
            throw new RuntimeException("Error al eliminar favorito: " + e.getMessage());
        }
    }
}
