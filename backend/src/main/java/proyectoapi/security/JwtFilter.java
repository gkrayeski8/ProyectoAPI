package proyectoapi.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/** Filtro que valida el token JWT en cada petición HTTP */
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    /** Intercepta la petición para autenticar al user mediante el token */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String jwt = extraerJwt(request);
            if (jwt != null && jwtUtils.validarTokenJwt(jwt)) {
                String nameUser = jwtUtils.getNameUserDeJwt(jwt);

                UserDetails detallesUser = userDetailsService.loadUserByUsername(nameUser);
                UsernamePasswordAuthenticationToken autenticacion = new UsernamePasswordAuthenticationToken(
                        detallesUser, null, detallesUser.getAuthorities());
                autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(autenticacion);
            }
        } catch (Exception e) {
            logger.error("No se puede establecer la autenticacion del user: {}", e);
        }

        filterChain.doFilter(request, response);
    }

    /** Extrae el token JWT de la cabecera Authorization o de una cookie */
    private String extraerJwt(HttpServletRequest request) {
        // Primero intentamos extraer el token de la cookie "jwt"
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        // Si no está en las cookies (por ejemplo, para API tests), buscamos en la cabecera Authorization
        String cabeceraAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(cabeceraAuth) && cabeceraAuth.startsWith("Bearer ")) {
            String token = cabeceraAuth.substring(7);
            if (StringUtils.hasText(token) && !token.equals("null") && !token.equals("undefined")) {
                return token;
            }
        }

        return null;
    }
}
