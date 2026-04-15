package proyectoapi.dto;

import lombok.Data;

@Data
public class ProductoResponseDTO {
    private Long id;
    private String titulo;
    private String descripcion;
    private String categoria;
    private String urlImagen;
}
