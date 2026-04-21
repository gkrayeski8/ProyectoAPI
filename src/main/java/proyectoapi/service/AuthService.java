package proyectoapi.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import proyectoapi.dto.JwtResponseDTO;
import proyectoapi.dto.LoginDTO;
import proyectoapi.dto.UsuarioRequestDTO;
import proyectoapi.dto.UsuarioResponseDTO;
import proyectoapi.security.JwtUtils;
import proyectoapi.security.UserDetailsImpl;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UsuarioService usuarioService;

    public JwtResponseDTO autenticarUsuario(LoginDTO peticionLogin) {
        Authentication autenticacion = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(peticionLogin.getEmail(), peticionLogin.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(autenticacion);
        String jwt = jwtUtils.generarTokenJwt(autenticacion);

        UserDetailsImpl detallesUsuario = (UserDetailsImpl) autenticacion.getPrincipal();

        return new JwtResponseDTO(jwt,
                detallesUsuario.getUsuario().getId(),
                detallesUsuario.getUsername(),
                detallesUsuario.getUsuario().getNombre(),
                detallesUsuario.getUsuario().getRole());
    }

    public JwtResponseDTO registrarUsuario(UsuarioRequestDTO peticion) {
        UsuarioResponseDTO nuevoUsuario = usuarioService.createUser(
                peticion.getNombre(),
                peticion.getApellido(),
                peticion.getEmail(),
                peticion.getPassword(),
                peticion.getRole());

        // Auto login despues del registro
        Authentication autenticacion = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(peticion.getEmail(), peticion.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(autenticacion);
        String jwt = jwtUtils.generarTokenJwt(autenticacion);

        return new JwtResponseDTO(jwt,
                nuevoUsuario.getId(),
                nuevoUsuario.getEmail(),
                nuevoUsuario.getNombre(),
                peticion.getRole());
    }
}
