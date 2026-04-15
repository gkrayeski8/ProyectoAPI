package proyectoapi.dto;
import lombok.Data;

@Data
public class PublicacionDTO {
    private String titulo;
    private String descripcion;
    private String categoria;
    private String urlImagen;
    private Long usuarioId;
    private Integer stock;
}
