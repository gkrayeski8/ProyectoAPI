package proyectoapi.dto;

import lombok.Data;
import java.util.List;

@Data
public class CarritoResponseDTO {
    private Long id;
    private Long usuarioId;
    private List<ItemCarritoResponseDTO> items;
    private Double total;
}
