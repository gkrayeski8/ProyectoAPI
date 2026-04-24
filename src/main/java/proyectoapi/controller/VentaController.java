package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    /** Extrae el email del usuario autenticado desde el JWT */
    private String getEmailAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    /** Procesa el checkout finalizando la compra del carrito */
    @PostMapping("/checkout")
    public ResponseEntity<VentaResponseDTO> realizarCheckout(@RequestBody VentaRequestDTO request) {
        VentaResponseDTO dto = ventaService.checkout(getEmailAutenticado(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /** Lista todas las compras del usuario autenticado */
    @GetMapping("/mis-compras")
    public ResponseEntity<List<VentaResponseDTO>> obtenerMisCompras() {
        return ResponseEntity.ok(ventaService.obtenerVentasPorUsuario(getEmailAutenticado()));
    }

    /** Lista todas las ventas realizadas por el usuario autenticado (como vendedor) */
    @GetMapping("/mis-ventas")
    public ResponseEntity<List<VentaResponseDTO>> obtenerMisVentas() {
        return ResponseEntity.ok(ventaService.obtenerVentasDeMisProductos(getEmailAutenticado()));
    }

    /** Obtiene el detalle de una venta/compra por su ID */
    @GetMapping("/{id}")
    public ResponseEntity<VentaResponseDTO> obtenerVentaPorId(@PathVariable Long id) {
        return ResponseEntity.ok(ventaService.obtenerVentaPorId(id));
    }

}
