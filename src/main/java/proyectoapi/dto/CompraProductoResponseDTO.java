package proyectoapi.dto;

import lombok.Data;

@Data
public class CompraProductoResponseDTO {
    private Long productoId;
    private String tituloProducto;
    private int cantidad;
    private Double precioUnitario;
}
