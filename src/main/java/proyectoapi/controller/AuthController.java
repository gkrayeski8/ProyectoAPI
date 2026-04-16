package proyectoapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import proyectoapi.dto.JwtResponseDTO;
import proyectoapi.dto.LoginDTO;
import proyectoapi.dto.UsuarioRequestDTO;
import proyectoapi.dto.UsuarioResponseDTO;
import proyectoapi.security.JwtUtils;
import proyectoapi.security.UserDetailsImpl;
import proyectoapi.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UsuarioService usuarioService;

    @PostMapping("/login")
    public ResponseEntity<?> autenticarUsuario(@RequestBody LoginDTO peticionLogin) {

        Authentication autenticacion = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(peticionLogin.getEmail(), peticionLogin.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(autenticacion);
        String jwt = jwtUtils.generarTokenJwt(autenticacion);

        UserDetailsImpl detallesUsuario = (UserDetailsImpl) autenticacion.getPrincipal();

        return ResponseEntity.ok(new JwtResponseDTO(jwt,
                detallesUsuario.getUsuario().getId(),
                detallesUsuario.getUsername(),
                detallesUsuario.getUsuario().getNombre(),
                detallesUsuario.getUsuario().getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRequestDTO peticion) {

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

        return ResponseEntity.ok(new JwtResponseDTO(jwt,
                nuevoUsuario.getId(),
                nuevoUsuario.getEmail(),
                nuevoUsuario.getNombre(),
                peticion.getRole()));
    }
}