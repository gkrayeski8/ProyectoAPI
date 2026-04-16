package proyectoapi.dto;

import lombok.Data;

@Data
public class UsuarioRequestDTO {
    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private proyectoapi.model.Role role;
}
