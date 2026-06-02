package proyectoapi.dto;

import lombok.Data;

@Data
public class ProductResponseDTO {
    private Long id;
    private String titulo;
    private String description;
    private String category;
    private String urlImage;
    private Double price;
    private Integer stock;
    private String vendedor;
}
