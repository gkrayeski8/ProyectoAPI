package proyectoapi.dto;

import lombok.Data;

@Data
public class UserRequestDTO {
    private String name;
    private String apellido;
    private String email;
    private String password;
    private proyectoapi.model.Role role;
}
