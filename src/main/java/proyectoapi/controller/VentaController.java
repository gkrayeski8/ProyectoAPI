package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import proyectoapi.dto.VentaRequestDTO;
import proyectoapi.dto.VentaResponseDTO;
import proyectoapi.service.VentaService;

import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    @PostMapping("/checkout")
    public VentaResponseDTO realizarCheckout(@RequestBody VentaRequestDTO request) {
        return ventaService.checkout(request);
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<VentaResponseDTO> obtenerVentasUsuario(@PathVariable Long usuarioId) {
        return ventaService.obtenerVentasPorUsuario(usuarioId);
    }
}
