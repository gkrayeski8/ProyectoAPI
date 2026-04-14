package proyectoapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import proyectoapi.model.Producto;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.model.Usuario;
import proyectoapi.repository.ProductoEnVentaRepository;
import proyectoapi.repository.ProductoRepository;
import proyectoapi.repository.UsuarioRepository;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ProductoEnVentaRepository productoEnVentaRepository;
    private final ProductoRepository productoRepository;

    public UsuarioService(UsuarioRepository usuarioRepository, ProductoEnVentaRepository productoEnVentaRepository, ProductoRepository productoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.productoEnVentaRepository = productoEnVentaRepository;
        this.productoRepository = productoRepository;
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


    public List<Usuario> getVendedores(){
        return usuarioRepository.findVendedores();
    }

    public ProductoEnVenta publicarProducto(Producto producto, Long id, Integer stock){
        Usuario user = usuarioRepository.findById(id).orElse(null);
        if (user == null){
            throw new RuntimeException("Usuario no encontrado con ID: " + id);
        }
        productoRepository.save(producto);
        ProductoEnVenta nuevoProductoVenta = new ProductoEnVenta();
        nuevoProductoVenta.setUsuario(user);
        nuevoProductoVenta.setProducto(producto);
        nuevoProductoVenta.setStock(stock);
        user.getProductosEnVenta().add(nuevoProductoVenta);
        return productoEnVentaRepository.save(nuevoProductoVenta);
    }
}
