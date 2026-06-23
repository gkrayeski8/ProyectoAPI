package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
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

    @Value("${jwt.expiration}")
    private int expiracionJwtMs;

    /** Endpoint para autenticar users y get su JWT */
    @PostMapping("/login")
    public ResponseEntity<JwtResponseDTO> autenticarUser(@RequestBody LoginDTO peticionLogin, HttpServletResponse response) {
        JwtResponseDTO respuesta = authService.autenticarUser(peticionLogin);
        agregarCookieJwt(response, respuesta.getToken());
        return ResponseEntity.ok(respuesta);
    }

    /** Endpoint para registrar nuevos users en la plataforma */
    @PostMapping("/register")
    public ResponseEntity<JwtResponseDTO> registrarUser(@RequestBody UserRequestDTO peticion, HttpServletResponse response) {
        JwtResponseDTO respuesta = authService.registrarUser(peticion);
        agregarCookieJwt(response, respuesta.getToken());
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED).body(respuesta);
    }

    /** Endpoint para cerrar sesión eliminando la cookie */
    @PostMapping("/logout")
    public ResponseEntity<?> cerrarSesion(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok().body("{\"message\": \"Sesión cerrada exitosamente\"}");
    }

    private void agregarCookieJwt(HttpServletResponse response, String jwt) {
        ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(expiracionJwtMs / 1000)
                .sameSite("Lax")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}