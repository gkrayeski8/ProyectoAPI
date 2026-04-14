package proyectoapi.dto;

import lombok.Data;

@Data
public class VentaRequestDTO {
    private Long usuarioId;
    private String metodoPago;
}
