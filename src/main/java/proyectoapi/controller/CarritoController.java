package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyectoapi.dto.CarritoProductoDTO;
import proyectoapi.dto.CarritoResponseDTO;
import proyectoapi.service.CarritoService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;

/** Endpoints para gestionar las operaciones del carrito de compras */
@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    /** Extrae el email del usuario autenticado desde el JWT */
    private String getEmailAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    /** Agrega un producto al carrito del usuario autenticado */
    @PostMapping("/agregar")
    public CarritoResponseDTO addProductCart(@RequestBody CarritoProductoDTO data) {
        return carritoService.addProductCart(data.getProductoId(), getEmailAutenticado(), data.getCantidad());
    }

    /** Obtiene el estado actual del carrito del usuario autenticado */
    @GetMapping
    public CarritoResponseDTO getCart() {
        return carritoService.getCartByUser(getEmailAutenticado());
    }

    /** Modifica la cantidad de un producto ya en el carrito */
    @PutMapping("/actualizar")
    public CarritoResponseDTO updateProductQuantity(@RequestBody CarritoProductoDTO data) {
        return carritoService.updateProductQuantity(data.getProductoId(), getEmailAutenticado(), data.getCantidad());
    }

    /** Quita un producto específico del carrito */
    @DeleteMapping("/producto/{productoId}")
    public CarritoResponseDTO removeProductFromCart(@PathVariable Long productoId) {
        return carritoService.removeProductFromCart(productoId, getEmailAutenticado());
    }

    /** Elimina todos los productos del carrito del usuario */
    @DeleteMapping("/vaciar")
    public CarritoResponseDTO emptyCart() {
        return carritoService.emptyCart(getEmailAutenticado());
    }

}
