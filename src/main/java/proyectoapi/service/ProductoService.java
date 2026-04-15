package proyectoapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proyectoapi.dto.ProductoResponseDTO;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.repository.ProductoEnVentaRepository;
import proyectoapi.repository.ProductoRepository;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoEnVentaRepository productoEnVentaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<ProductoResponseDTO> obtenerCatalogo() {
        return productoEnVentaRepository.findAllByOrderByProductoTituloAsc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<String> obtenerCategorias() {
        return productoRepository.findDistinctCategorias();
    }

    public ProductoResponseDTO obtenerDetalle(Long id) {
        ProductoEnVenta productoEnVenta = productoEnVentaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Publicación no encontrada"));
        return mapToDTO(productoEnVenta);
    }

    private ProductoResponseDTO mapToDTO(ProductoEnVenta pve) {
        ProductoResponseDTO dto = new ProductoResponseDTO();
        dto.setId(pve.getId());
        dto.setTitulo(pve.getProducto().getTitulo());
        dto.setDescripcion(pve.getProducto().getDescripcion());
        dto.setCategoria(pve.getProducto().getCategoria());
        dto.setUrlImagen(pve.getProducto().getUrlImagen());
        return dto;
    }
}
