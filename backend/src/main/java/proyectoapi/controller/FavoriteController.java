package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyectoapi.dto.FavoriteRequestDTO;
import proyectoapi.dto.MessageResponseDTO;
import proyectoapi.service.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    /** Extrae el email del user autenticado desde el JWT */
    private String getEmailAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    /** Agrega un product a favoritos */
    @PostMapping("/add")
    public ResponseEntity<MessageResponseDTO> addFavorite(@RequestBody FavoriteRequestDTO data) {
        return ResponseEntity.ok(favoriteService.addFavorite(data.getProductId(), getEmailAutenticado()));
    }

    /** Quita un product específico de favoritos */
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<MessageResponseDTO> removeFavorite(@PathVariable Long productId) {
        return ResponseEntity.ok(favoriteService.removeFavorite(productId, getEmailAutenticado()));
    }

    /** Elimina todos los favoritos del usuario */
    @DeleteMapping("/clear")
    public ResponseEntity<MessageResponseDTO> clearFavorites() {
        return ResponseEntity.ok(favoriteService.clearFavorites(getEmailAutenticado()));
    }

}
