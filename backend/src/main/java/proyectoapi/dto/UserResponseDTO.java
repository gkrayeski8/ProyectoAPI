package proyectoapi.dto;

import lombok.Data;
import proyectoapi.model.Role;

@Data
public class UserResponseDTO {
    private Long id;
    private String name;
    private String apellido;
    private String email;
    private Role role;
    // IMPORTANTE: No incluir el password aquí
}
