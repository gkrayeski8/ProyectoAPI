package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import proyectoapi.dto.VentaRequestDTO;
import proyectoapi.dto.VentaResponseDTO;
import proyectoapi.service.VentaService;

import java.util.List;

/** Endpoints para procesar compras y consultar historial de ventas */
@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @Autowired
    private proyectoapi.service.UsuarioService usuarioService;

    /** Procesa el checkout finalizando la compra del carrito */
    @PostMapping("/checkout")
    public VentaResponseDTO realizarCheckout(@RequestBody VentaRequestDTO request) {
        usuarioService.validarPropietario(request.getUsuarioId());
        return ventaService.checkout(request);
    }

    /** Lista todas las compras realizadas por un usuario */
    @GetMapping("/usuario/{usuarioId}")
    public List<VentaResponseDTO> obtenerVentasUsuario(@PathVariable Long usuarioId) {
        usuarioService.validarPropietario(usuarioId);
        return ventaService.obtenerVentasPorUsuario(usuarioId);
    }
}
