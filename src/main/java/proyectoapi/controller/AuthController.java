package proyectoapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import proyectoapi.dto.JwtResponseDTO;
import proyectoapi.dto.LoginDTO;
import proyectoapi.dto.UsuarioRequestDTO;
import proyectoapi.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> autenticarUsuario(@RequestBody LoginDTO peticionLogin) {
        return ResponseEntity.ok(authService.autenticarUsuario(peticionLogin));
    }

    @PostMapping("/register")
    public ResponseEntity<JwtResponseDTO> registrarUsuario(@RequestBody UsuarioRequestDTO peticion) {
        return ResponseEntity.ok(authService.registrarUsuario(peticion));
    }
}