package proyectoapi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import proyectoapi.dto.JwtResponseDTO;
import proyectoapi.dto.LoginDTO;
import proyectoapi.dto.UserRequestDTO;
import proyectoapi.service.AuthService;

/** Endpoints para autenticación, inicio de sesión y register */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** Endpoint para autenticar users y get su JWT */
    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> autenticarUser(@RequestBody LoginDTO peticionLogin) {
        return ResponseEntity.ok(authService.autenticarUser(peticionLogin));
    }

    /** Endpoint para registrar nuevos users en la plataforma */
    @PostMapping("/register")
    public ResponseEntity<JwtResponseDTO> registrarUser(@RequestBody UserRequestDTO peticion) {
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(authService.registrarUser(peticion));
    }
}