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

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @PostMapping("/agregar")
    public CarritoResponseDTO addProductCart(@RequestBody CarritoProductoDTO data) {
        return carritoService.addProductCart(data.getProductoId(), data.getUsuarioId(), data.getCantidad());
    }

    @GetMapping("/{usuarioId}")
    public CarritoResponseDTO getCart(@PathVariable Long usuarioId) {
        return carritoService.getCartByUser(usuarioId);
    }

}
