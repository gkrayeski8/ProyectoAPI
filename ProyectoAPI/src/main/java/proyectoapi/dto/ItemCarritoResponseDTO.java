package proyectoapi.dto;

import lombok.Data;

@Data
public class ItemCarritoResponseDTO {
    private Long id;
    private Long productoId;
    private String nombreProducto;
    private int cantidad;
    private Double precioUnitario;
    private Double subtotal;
}
