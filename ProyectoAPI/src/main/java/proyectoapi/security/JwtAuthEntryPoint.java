package proyectoapi.security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/** Maneja errores de autenticación devolviendo código 401 */
@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    /** Se activa cuando un usuario no autenticado accede a un recurso */
    @Override
    public void commence(HttpServletRequest peticion, HttpServletResponse respuesta,
            AuthenticationException excepcionAuth) throws IOException, ServletException {
        // Retornar 401 No autorizado
        respuesta.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Error: No autorizado");
    }
}
