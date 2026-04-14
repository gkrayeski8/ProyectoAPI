package proyectoapi.service;

import org.springframework.stereotype.Service;

import proyectoapi.model.Usuario;
import proyectoapi.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario createUser(String nombre, String apellido, String email, String password){
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setPassword(password);
        return usuarioRepository.save(usuario);
    }

    public Usuario iniciarSesion(String email, String password) {
        Integer contador = 0;
        Usuario usuario = usuarioRepository.findByEmail(email);
        while(contador < 3 && usuario != null && !usuario.isBloqueado()) {
            if (usuario.getPassword().equals(password)) {
                return usuario;
            } else {
                contador++;
                if (contador >= 3) {
                    usuario.setBloqueado(true);
                    usuarioRepository.save(usuario);
                    throw new RuntimeException("Cuenta bloqueada por múltiples intentos fallidos");
                }
                throw new RuntimeException("Contraseña incorrecta");
            }
            
        }
        if (usuario == null){
            throw new RuntimeException("Usuario no encontrado");
        }else {
            throw new RuntimeException("Cuenta bloqueada, volve mañana a las 12:00");
        }
    }

}
