package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import proyectoapi.dto.ProductoResponseDTO;
import proyectoapi.service.ProductoService;

import java.util.List;

@RestController
@RequestMapping("/api/publicaciones")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<ProductoResponseDTO> obtenerCatalogo() {
        return productoService.obtenerCatalogo();
    }

    @GetMapping("/categorias")
    public List<String> obtenerCategorias() {
        return productoService.obtenerCategorias();
    }

    @GetMapping("/{id}")
    public ProductoResponseDTO obtenerDetalle(@PathVariable Long id) {
        return productoService.obtenerDetalle(id);
    }
}
