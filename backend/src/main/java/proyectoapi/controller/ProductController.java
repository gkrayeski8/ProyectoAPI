package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import proyectoapi.dto.ProductResponseDTO;
import proyectoapi.service.ProductService;

import java.util.List;

/** Endpoints para consultar el catálogo y detalles de products */
@RestController
@RequestMapping("/api/publications")
public class ProductController {

    @Autowired
    private ProductService productService;

    /** Devuelve la lista completa de products en el catálogo, opcionalmente filtrada por categoría o búsqueda */
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getCatalogo(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(productService.getCatalogo(category, search));
    }

    /** Lista todas las categorías disponibles de products */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(productService.getCategories());
    }

    /** Obtiene la información detallada de un product por ID */
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getDetalle(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getDetalle(id));
    }
}
