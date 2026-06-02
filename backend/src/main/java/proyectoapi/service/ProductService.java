package proyectoapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proyectoapi.dto.ProductResponseDTO;
import proyectoapi.model.SaleProduct;
import proyectoapi.repository.SaleProductRepository;
import proyectoapi.repository.ProductRepository;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import proyectoapi.exception.ResourceNotFoundException;

/** Proporciona servicios para la gestión y consulta de products */
@Service
@Transactional
public class ProductService {

    @Autowired
    private SaleProductRepository saleProductRepository;

    @Autowired
    private ProductRepository productRepository;

    /** Obtiene all los products, opcionalmente filtrados por categoría y ordenados por título */
    public List<ProductResponseDTO> getCatalogo(String category) {
        List<SaleProduct> products;
        if (category != null && !category.isEmpty()) {
            products = saleProductRepository.findByProductCategoryAndActivoTrueOrderByProductTituloAsc(category);
        } else {
            products = saleProductRepository.findByActivoTrueOrderByProductTituloAsc();
        }
        return products.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /** Obtiene la lista de categorías únicas de products */
    public List<String> getCategorys() {
        return productRepository.findDistinctCategorys();
    }

    /** Busca los detalles de un product por su ID */
    public ProductResponseDTO getDetalle(Long id) {
        SaleProduct saleProduct = saleProductRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Publicación no encontrada"));
        if (!saleProduct.isActivo()) {
            throw new ResourceNotFoundException("Publicación no encontrada");
        }
        return mapToDTO(saleProduct);
    }

    /** Convierte una entidad SaleProduct a DTO */
    private ProductResponseDTO mapToDTO(SaleProduct pve) {
        ProductResponseDTO dto = new ProductResponseDTO();
        dto.setId(pve.getId());
        dto.setTitulo(pve.getProduct().getTitulo());
        dto.setDescription(pve.getProduct().getDescription());
        dto.setCategory(pve.getProduct().getCategory());
        dto.setUrlImage(pve.getProduct().getUrlImage());
        dto.setPrice(pve.getPrice());
        dto.setStock(pve.getStock());
        dto.setVendedor(pve.getUser().getName() + " " + pve.getUser().getApellido());
        return dto;
    }
}
