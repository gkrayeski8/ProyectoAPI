package proyectoapi.dto;

import lombok.Data;

@Data
public class CartItemResponseDTO {
    private Long id;
    private Long productId;
    private String nameProduct;
    private String urlImage;
    private int quantity;
    private Double priceUnitario;
    private Double subtotal;
}
