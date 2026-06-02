package proyectoapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import proyectoapi.dto.JwtResponseDTO;
import proyectoapi.dto.LoginDTO;
import proyectoapi.dto.UserRequestDTO;
import proyectoapi.dto.UserResponseDTO;
import proyectoapi.security.JwtUtils;
import proyectoapi.security.UserDetailsImpl;

/** Servicio para gestionar la autenticación y register de users */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    /** Valida credenciales y devuelve un token JWT */
    public JwtResponseDTO autenticarUser(LoginDTO peticionLogin) {
        Authentication autenticacion = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(peticionLogin.getEmail(), peticionLogin.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(autenticacion);
        String jwt = jwtUtils.generarTokenJwt(autenticacion);

        UserDetailsImpl detallesUser = (UserDetailsImpl) autenticacion.getPrincipal();

        return new JwtResponseDTO(jwt,
                detallesUser.getUser().getId(),
                detallesUser.getUsername(),
                detallesUser.getUser().getName(),
                detallesUser.getUser().getRole());
    }

    /** Registra un nuevo user y devuelve su token */
    public JwtResponseDTO registrarUser(UserRequestDTO peticion) {
        UserResponseDTO nuevoUser = userService.createUser(
                peticion.getName(),
                peticion.getApellido(),
                peticion.getEmail(),
                peticion.getPassword(),
                peticion.getRole());

        // Auto login despues del register
        Authentication autenticacion = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(peticion.getEmail(), peticion.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(autenticacion);
        String jwt = jwtUtils.generarTokenJwt(autenticacion);

        return new JwtResponseDTO(jwt,
                nuevoUser.getId(),
                nuevoUser.getEmail(),
                nuevoUser.getName(),
                peticion.getRole());
    }
}
