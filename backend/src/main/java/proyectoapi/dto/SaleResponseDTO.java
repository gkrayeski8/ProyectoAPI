package proyectoapi.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class SaleResponseDTO {
    private Long saleId;
    private Long userId;
    private Double totalPagado;
    private LocalDateTime fechaSale;
    private String mensaje;
    private String direccionEnvio;
    private String metodoPago;
    private List<PurchaseItemResponseDTO> items;
}
