package proyectoapi.dto;
import lombok.Data;

@Data
public class PublicacionDTO {
    private String titulo;
    private String descripcion;
    private String categoria;
    private String urlImagen;
    private Integer stock;
    private Double precio;
}
