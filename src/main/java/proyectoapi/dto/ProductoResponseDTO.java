package proyectoapi.dto;

import lombok.Data;

@Data
public class ProductoResponseDTO {
    private Long id;
    private String titulo;
    private Integer precio;
    private String descripcion;
    private String categoria;
}
