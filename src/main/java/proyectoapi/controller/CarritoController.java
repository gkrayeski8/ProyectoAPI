package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private proyectoapi.service.UsuarioService usuarioService;

    /** Agrega un producto al carrito del usuario */
    @PostMapping("/agregar")
    public CarritoResponseDTO addProductCart(@RequestBody CarritoProductoDTO data) {
        usuarioService.validarPropietario(data.getUsuarioId());
        return carritoService.addProductCart(data.getProductoId(), data.getUsuarioId(), data.getCantidad());
    }

    /** Obtiene el estado actual del carrito del usuario */
    @GetMapping("/{usuarioId}")
    public CarritoResponseDTO getCart(@PathVariable Long usuarioId) {
        usuarioService.validarPropietario(usuarioId);
        return carritoService.getCartByUser(usuarioId);
    }

    /** Modifica la cantidad de un producto ya en el carrito */
    @PutMapping("/actualizar")
    public CarritoResponseDTO updateProductQuantity(@RequestBody CarritoProductoDTO data) {
        usuarioService.validarPropietario(data.getUsuarioId());
        return carritoService.updateProductQuantity(data.getProductoId(), data.getUsuarioId(), data.getCantidad());
    }

    /** Quita un producto específico del carrito */
    @DeleteMapping("/{usuarioId}/producto/{productoId}")
    public CarritoResponseDTO removeProductFromCart(@PathVariable Long usuarioId, @PathVariable Long productoId) {
        usuarioService.validarPropietario(usuarioId);
        return carritoService.removeProductFromCart(productoId, usuarioId);
    }

    /** Elimina todos los productos del carrito del usuario */
    @DeleteMapping("/{usuarioId}/vaciar")
    public CarritoResponseDTO emptyCart(@PathVariable Long usuarioId) {
        usuarioService.validarPropietario(usuarioId);
        return carritoService.emptyCart(usuarioId);
    }

}
