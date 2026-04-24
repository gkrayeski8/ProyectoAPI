package proyectoapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import proyectoapi.dto.UsuarioResponseDTO;
import proyectoapi.model.Producto;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.model.Usuario;
import proyectoapi.repository.ProductoEnVentaRepository;
import proyectoapi.repository.ProductoRepository;
import proyectoapi.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import proyectoapi.exception.ResourceNotFoundException;
import proyectoapi.exception.BusinessLogicException;
import proyectoapi.model.Role;

/** Gestiona usuarios, perfiles, login y publicaciones de vendedores */
@Service
@Transactional
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ProductoEnVentaRepository productoEnVentaRepository;
    private final ProductoRepository productoRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, ProductoEnVentaRepository productoEnVentaRepository,
            ProductoRepository productoRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.productoEnVentaRepository = productoEnVentaRepository;
        this.productoRepository = productoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** Crea un nuevo usuario en el sistema */
    public UsuarioResponseDTO createUser(String nombre, String apellido, String email, String password, Role role) {
        // Verificacion de que el email no exista
        if (usuarioRepository.findByEmail(email) != null) {
            throw new BusinessLogicException("Error: El email ya existe");
        }

        // Creacion del usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        usuario.setEmail(email);
        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRole(role != null ? role : Role.COMPRADOR);
        Usuario saved = usuarioRepository.save(usuario);

        UsuarioResponseDTO response = new UsuarioResponseDTO();
        response.setId(saved.getId());
        response.setNombre(saved.getNombre());
        response.setApellido(saved.getApellido());
        response.setEmail(saved.getEmail());
        return response;
    }

    /** Valida el acceso del usuario y gestiona bloqueos */
    public Usuario iniciarSesion(String email, String password) {
        Integer contador = 0;
        Usuario usuario = usuarioRepository.findByEmail(email);
        while (contador < 3 && usuario != null && !usuario.isBloqueado()) {
            if (usuario.getPassword().equals(password)) {
                return usuario;
            } else {
                contador++;
                if (contador >= 3) {
                    usuario.setBloqueado(true);
                    usuarioRepository.save(usuario);
                    throw new BusinessLogicException("Cuenta bloqueada por múltiples intentos fallidos");
                }
                throw new BadCredentialsException("Contraseña incorrecta");
            }

        }
        if (usuario == null) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        } else {
            throw new BusinessLogicException("Cuenta bloqueada, volve mañana a las 12:00");
        }
    }

    /** Lista todos los usuarios con rol VENDEDOR */
    public List<Usuario> getVendedores() {
        return usuarioRepository.findVendedores();
    }

    /** Permite a un vendedor publicar un nuevo producto */
    public ProductoEnVenta publicarProducto(String titulo, String descripcion, String categoria, String urlImagen,
            Long id, Integer stock, Double precio) {
        Usuario user = usuarioRepository.findById(id).orElse(null);
        if (user == null) {
            throw new ResourceNotFoundException("Usuario no encontrado con ID: " + id);
        }
        Producto producto = crearProducto(titulo, descripcion, categoria, urlImagen);
        ProductoEnVenta nuevoProductoVenta = new ProductoEnVenta();
        nuevoProductoVenta.setUsuario(user);
        nuevoProductoVenta.setProducto(producto);
        nuevoProductoVenta.setStock(stock);
        nuevoProductoVenta.setPrecio(precio);
        user.getProductosEnVenta().add(nuevoProductoVenta);
        return productoEnVentaRepository.save(nuevoProductoVenta);
    }

    /** Elimina una publicación de producto por su ID */
    public void eliminarProducto(Long id) {
        if (!productoEnVentaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto en venta no encontrado con ID: " + id);
        }
        productoEnVentaRepository.deleteById(id);
    }

    /** Actualiza el precio de un producto si pertenece al usuario */
    public void updatePrecioProducto(Double precioNuevo, Long idUsuario, Long id) {
        ProductoEnVenta producto = productoEnVentaRepository.findById(id).orElse(null);
        Usuario user = usuarioRepository.findById(id).orElse(null);
        if (producto == null) {
            throw new ResourceNotFoundException("Producto no encontrado con ID: " + id);
        }
        if (user.getId().equals(idUsuario)) {
            producto.setPrecio(precioNuevo);
            productoEnVentaRepository.save(producto);
        } else {
            throw new AccessDeniedException("no es un producto de usted, actualizacion de precio denegada!");
        }

    }

    /** Crea y persiste un objeto Producto base */
    private Producto crearProducto(String titulo, String descripcion, String categoria, String urlImagen) {
        Producto producto = new Producto();
        producto.setTitulo(titulo);
        producto.setCategoria(categoria);
        producto.setDescripcion(descripcion);
        producto.setUrlImagen(urlImagen);
        return productoRepository.save(producto);
    }
}
