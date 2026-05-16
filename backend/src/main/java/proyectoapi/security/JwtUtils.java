package proyectoapi.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Date;

/** Utilidad para generar, extraer y validar tokens JWT */
@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secretoJwt;

    @Value("${jwt.expiration}")
    private int expiracionJwtMs;

    private Key clave;

    /** Inicializa la clave de firma al arrancar el componente */
    @PostConstruct
    public void init() {
        this.clave = Keys.hmacShaKeyFor(secretoJwt.getBytes());
    }

    /** Crea un token firmado para el usuario autenticado */
    public String generarTokenJwt(Authentication autenticacion) {
        UserDetailsImpl usuarioPrincipal = (UserDetailsImpl) autenticacion.getPrincipal();

        return Jwts.builder()
                .setSubject((usuarioPrincipal.getUsername()))
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + expiracionJwtMs))
                .signWith(clave, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Recupera el nombre de usuario contenido en el token */
    public String obtenerNombreUsuarioDeJwt(String token) {
        return Jwts.parserBuilder().setSigningKey(clave).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    /** Verifica si el token es válido y no ha expirado */
    public boolean validarTokenJwt(String tokenAuth) {
        try {
            Jwts.parserBuilder().setSigningKey(clave).build().parseClaimsJws(tokenAuth);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Token JWT invalido
        }
        return false;
    }
}
