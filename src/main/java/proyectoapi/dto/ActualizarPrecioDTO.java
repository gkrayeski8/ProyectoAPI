package proyectoapi.dto;

import lombok.Data;

@Data
public class ActualizarPrecioDTO {
    Long id;
    Double precioNuevo;
    Long usuarioId;

}
