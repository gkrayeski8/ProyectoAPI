package proyectoapi.dto;

import lombok.Data;

@Data
public class CarritoProductoDTO {
    private Long productoId;
    private Long usuarioId;
    private int cantidad;
}
