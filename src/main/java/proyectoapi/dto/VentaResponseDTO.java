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
    private List<CompraProductoResponseDTO> items;
}
