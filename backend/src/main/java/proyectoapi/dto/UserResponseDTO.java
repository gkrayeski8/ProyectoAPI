package proyectoapi.dto;

import lombok.Data;

@Data
public class UserResponseDTO {
    private Long id;
    private String name;
    private String apellido;
    private String email;
    // IMPORTANTE: No incluir el password aquí
}
