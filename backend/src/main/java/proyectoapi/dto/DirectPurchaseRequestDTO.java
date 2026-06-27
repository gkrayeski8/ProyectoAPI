package proyectoapi.dto;

import lombok.Data;

@Data
public class DirectPurchaseRequestDTO {
    private Long productId;
    private Integer quantity;
    private String metodoPago;
    private String direccionEnvio;
}
