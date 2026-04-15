package proyectoapi.dto;

import lombok.Data;
import proyectoapi.model.Usuario;

@Data
public class ActualizarPrecioDTO {
    Long id;
    Double precioNuevo;
    Usuario usuario;
    
}
