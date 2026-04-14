package proyectoapi.dto;

import lombok.Data;
import proyectoapi.model.Producto;

@Data
public class PublicacionDTO {
    private Producto producto;
    private Long usuarioId;
    private Integer stock;
}
