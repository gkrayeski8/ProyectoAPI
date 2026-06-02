package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyectoapi.dto.CartProductDTO;
import proyectoapi.dto.CartResponseDTO;
import proyectoapi.service.CartService;

/** Endpoints para gestionar las operaciones del cart de compras */
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    /** Extrae el email del user autenticado desde el JWT */
    private String getEmailAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    /** Agrega un product al cart del user autenticado */
    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addProductCart(@RequestBody CartProductDTO data) {
        return ResponseEntity.ok(cartService.addProductCart(data.getProductId(), getEmailAutenticado(), data.getQuantity()));
    }

    /** Obtiene el estado actual del cart del user autenticado */
    @GetMapping
    public ResponseEntity<CartResponseDTO> getCart() {
        return ResponseEntity.ok(cartService.getCartByUser(getEmailAutenticado()));
    }

    /** Modifica la quantity de un product ya en el cart */
    @PutMapping("/update")
    public ResponseEntity<CartResponseDTO> updateProductQuantity(@RequestBody CartProductDTO data) {
        return ResponseEntity.ok(cartService.updateProductQuantity(data.getProductId(), getEmailAutenticado(), data.getQuantity()));
    }

    /** Quita un product específico del cart */
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<CartResponseDTO> removeProductFromCart(@PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeProductFromCart(productId, getEmailAutenticado()));
    }

    /** Elimina all los products del cart del user */
    @DeleteMapping("/clear")
    public ResponseEntity<CartResponseDTO> emptyCart() {
        return ResponseEntity.ok(cartService.emptyCart(getEmailAutenticado()));
    }

}
