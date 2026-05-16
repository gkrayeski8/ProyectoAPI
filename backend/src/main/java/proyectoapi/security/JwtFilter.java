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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/** Filtro que valida el token JWT en cada petición HTTP */
@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    /** Intercepta la petición para autenticar al usuario mediante el token */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String jwt = extraerJwt(request);
            if (jwt != null && jwtUtils.validarTokenJwt(jwt)) {
                String nombreUsuario = jwtUtils.obtenerNombreUsuarioDeJwt(jwt);

                UserDetails detallesUsuario = userDetailsService.loadUserByUsername(nombreUsuario);
                UsernamePasswordAuthenticationToken autenticacion = new UsernamePasswordAuthenticationToken(
                        detallesUsuario, null, detallesUsuario.getAuthorities());
                autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(autenticacion);
            }
        } catch (Exception e) {
            logger.error("No se puede establecer la autenticacion del usuario: {}", e);
        }

        filterChain.doFilter(request, response);
    }

    /** Extrae el token JWT de la cabecera Authorization */
    private String extraerJwt(HttpServletRequest request) {
        String cabeceraAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(cabeceraAuth) && cabeceraAuth.startsWith("Bearer ")) {
            return cabeceraAuth.substring(7);
        }

        return null;
    }
}
