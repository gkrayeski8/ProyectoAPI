package proyectoapi.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

/** Configuración global de seguridad, filtros y permisos de rutas */
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final JwtAuthEntryPoint manejadorNoAutorizado;
    private final JwtFilter jwtFilter;

    /** Define el proveedor de autenticación con UserDetails y PasswordEncoder */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider proveedorAuth = new DaoAuthenticationProvider(userDetailsService);
        proveedorAuth.setPasswordEncoder(passwordEncoder());
        return proveedorAuth;
    }

    /** Expone el AuthenticationManager para ser usado en otros servicios */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configAuth) throws Exception {
        return configAuth.getAuthenticationManager();
    }

    /** Configura el algoritmo BCrypt para encriptar contraseñas */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /** Define la cadena de filtros y reglas de autorización HTTP */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(excepcion -> excepcion.authenticationEntryPoint(manejadorNoAutorizado))
                .sessionManagement(sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(autenticacion -> autenticacion.requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/publications/**").permitAll() // catálogo público
                        .requestMatchers("/api/users/product/**").hasRole("VENDEDOR") // solo vendedores
                        .requestMatchers("/api/cart/**").hasAnyRole("COMPRADOR", "VENDEDOR", "ADMIN")
                        .requestMatchers("/api/compras/**").hasAnyRole("COMPRADOR", "VENDEDOR", "ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated());

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Activar CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
