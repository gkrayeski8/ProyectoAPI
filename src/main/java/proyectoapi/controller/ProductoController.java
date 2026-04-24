package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import proyectoapi.dto.ProductoResponseDTO;
import proyectoapi.service.ProductoService;

import java.util.List;

/** Endpoints para consultar el catálogo y detalles de productos */
@RestController
@RequestMapping("/api/publicaciones")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    /** Devuelve la lista completa de productos en el catálogo */
    @GetMapping
    public List<ProductoResponseDTO> obtenerCatalogo() {
        return productoService.obtenerCatalogo();
    }

    /** Lista todas las categorías disponibles de productos */
    @GetMapping("/categorias")
    public List<String> obtenerCategorias() {
        return productoService.obtenerCategorias();
    }

    /** Obtiene la información detallada de un producto por ID */
    @GetMapping("/{id}")
    public ProductoResponseDTO obtenerDetalle(@PathVariable Long id) {
        return productoService.obtenerDetalle(id);
    }
}
