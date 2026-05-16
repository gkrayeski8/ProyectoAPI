package proyectoapi.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class VentaResponseDTO {
    private Long ventaId;
    private Long usuarioId;
    private Double totalPagado;
    private LocalDateTime fechaVenta;
    private String mensaje;
    private String direccionEnvio;
    private String metodoPago;
    private List<CompraProductoResponseDTO> items;
}
