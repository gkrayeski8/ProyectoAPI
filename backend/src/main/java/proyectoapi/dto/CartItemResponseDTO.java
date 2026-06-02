package proyectoapi.dto;

import lombok.Data;

@Data
public class CartItemResponseDTO {
    private Long id;
    private Long productId;
    private String nameProduct;
    private int quantity;
    private Double priceUnitario;
    private Double subtotal;
}
