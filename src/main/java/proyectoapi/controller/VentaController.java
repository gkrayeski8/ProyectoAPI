package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import proyectoapi.dto.VentaRequestDTO;
import proyectoapi.dto.VentaResponseDTO;
import proyectoapi.service.VentaService;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestParam;

/** Endpoints para procesar compras y consultar historial de ventas */
@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    /** Extrae el email del usuario autenticado desde el JWT */
    private String getEmailAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    /** Procesa el checkout finalizando la compra del carrito */
    @PostMapping("/checkout")
    public VentaResponseDTO realizarCheckout(@RequestBody VentaRequestDTO request) {
        return ventaService.checkout(getEmailAutenticado(), request);
    }

    /** Lista todas las compras del usuario autenticado */
    @GetMapping("/mis-compras")
    public List<VentaResponseDTO> obtenerMisCompras() {
        return ventaService.obtenerVentasPorUsuario(getEmailAutenticado());
    }

    /**
     * Lista todas las ventas realizadas por el usuario autenticado (como vendedor)
     */
    @GetMapping("/mis-ventas")
    public List<VentaResponseDTO> obtenerMisVentas() {
        return ventaService.obtenerVentasDeMisProductos(getEmailAutenticado());
    }

    @GetMapping("/{id}")
    public VentaResponseDTO obtenerVentaPorId(@PathVariable Long id) {
        return ventaService.obtenerVentaPorId(id);
    }

}
