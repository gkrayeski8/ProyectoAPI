package proyectoapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import proyectoapi.dto.ProductoResponseDTO;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        // Evitar que el usuario se asigne el rol de ADMIN maliciosamente
        usuario.setRole(role != null && role != Role.ADMIN ? role : Role.COMPRADOR);
        Usuario saved = usuarioRepository.save(usuario);

        UsuarioResponseDTO response = new UsuarioResponseDTO();
        response.setId(saved.getId());
        response.setNombre(saved.getNombre());
        response.setApellido(saved.getApellido());
        response.setEmail(saved.getEmail());
        return response;
    }

    /** Obtiene el usuario actualmente autenticado desde el JWT */
    public Usuario getUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser")) {
            return usuarioRepository.findByEmail(auth.getName());
        }
        return null;
    }

    /** Valida que el ID enviado coincida con el usuario autenticado */
    public void validarPropietario(Long idUsuarioEnviado) {
        Usuario authUser = getUsuarioAutenticado();
        if (authUser == null || !authUser.getId().equals(idUsuarioEnviado)) {
            throw new AccessDeniedException("No tienes permisos para acceder o modificar recursos de otro usuario");
        }
    }

    /** Lista todos los usuarios con rol VENDEDOR */
    public List<Usuario> getVendedores() {
        return usuarioRepository.findVendedores();
    }

    /** Permite a un vendedor publicar un nuevo producto */
    public ProductoResponseDTO publicarProducto(String titulo, String descripcion, String categoria, String urlImagen,
            Integer stock, Double precio) {
        Usuario user = getUsuarioAutenticado();
        if (user == null) {
            throw new ResourceNotFoundException("Usuario autenticado no encontrado");
        }
        Producto producto = crearProducto(titulo, descripcion, categoria, urlImagen);
        ProductoEnVenta nuevoProductoVenta = new ProductoEnVenta();
        nuevoProductoVenta.setUsuario(user);
        nuevoProductoVenta.setProducto(producto);
        nuevoProductoVenta.setStock(stock);
        nuevoProductoVenta.setPrecio(precio);
        user.getProductosEnVenta().add(nuevoProductoVenta);
        ProductoEnVenta saved = productoEnVentaRepository.save(nuevoProductoVenta);
        
        ProductoResponseDTO response = new ProductoResponseDTO();
        response.setId(saved.getId());
        response.setTitulo(saved.getProducto().getTitulo());
        response.setDescripcion(saved.getProducto().getDescripcion());
        response.setCategoria(saved.getProducto().getCategoria());
        response.setUrlImagen(saved.getProducto().getUrlImagen());
        response.setPrecio(saved.getPrecio());
        response.setStock(saved.getStock());
        response.setVendedor(user.getNombre() + " " + user.getApellido());
        
        return response;
    }

    /** Realiza un borrado lógico de una publicación de producto por su ID */
    public void eliminarProducto(Long id) {
        ProductoEnVenta producto = productoEnVentaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto en venta no encontrado con ID: " + id));

        validarPropietario(producto.getUsuario().getId());

        producto.setActivo(false);
        productoEnVentaRepository.save(producto);
    }

    /** Actualiza el precio de un producto si pertenece al usuario autenticado */
    public void updatePrecioProducto(Double precioNuevo, Long id) {
        ProductoEnVenta producto = productoEnVentaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));

        // Valida que el producto pertenezca al usuario del JWT
        validarPropietario(producto.getUsuario().getId());

        producto.setPrecio(precioNuevo);
        productoEnVentaRepository.save(producto);
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
