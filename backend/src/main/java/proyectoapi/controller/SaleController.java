package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import proyectoapi.dto.SaleRequestDTO;
import proyectoapi.dto.SaleResponseDTO;
import proyectoapi.service.SaleService;

import java.util.List;

/** Endpoints para procesar compras y consultar historial de sales */
@RestController
@RequestMapping("/api/sales")
public class SaleController {

    @Autowired
    private SaleService saleService;

    /** Extrae el email del user autenticado desde el JWT */
    private String getEmailAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    /** Procesa el checkout finalizando la compra del cart */
    @PostMapping("/checkout")
    public ResponseEntity<SaleResponseDTO> realizarCheckout(@RequestBody SaleRequestDTO request) {
        SaleResponseDTO dto = saleService.checkout(getEmailAutenticado(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /** Procesa una compra directa saltándose el carrito */
    @PostMapping("/direct")
    public ResponseEntity<SaleResponseDTO> directPurchase(@RequestBody proyectoapi.dto.DirectPurchaseRequestDTO request) {
        SaleResponseDTO dto = saleService.directPurchase(getEmailAutenticado(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /** Lista todas las compras del user autenticado */
    @GetMapping("/mis-compras")
    public ResponseEntity<List<SaleResponseDTO>> getMisCompras() {
        return ResponseEntity.ok(saleService.getSalesPorUser(getEmailAutenticado()));
    }

    /** Lista todas las sales realizadas por el user autenticado (como vendedor) */
    @GetMapping("/mis-sales")
    public ResponseEntity<List<SaleResponseDTO>> getMisSales() {
        return ResponseEntity.ok(saleService.getSalesDeMisProducts(getEmailAutenticado()));
    }

    /** Obtiene el detalle de una sale/compra por su ID */
    @GetMapping("/{id}")
    public ResponseEntity<SaleResponseDTO> getSaleById(@PathVariable Long id) {
        return ResponseEntity.ok(saleService.getSaleById(id));
    }

}
