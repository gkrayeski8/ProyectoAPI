package proyectoapi.dto;

import lombok.Data;

@Data
public class PurchaseItemResponseDTO {
    private Long productId;
    private String tituloProduct;
    private int quantity;
    private Double priceUnitario;
}
