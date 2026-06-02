package proyectoapi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import proyectoapi.model.Role;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDTO {
    private String token;
    private String tipo = "Bearer";
    private Long id;
    private String email;
    private String name;
    private Role role;

    public JwtResponseDTO(String token, Long id, String email, String name, Role role) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }
}
