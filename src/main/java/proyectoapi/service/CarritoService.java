package proyectoapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import proyectoapi.model.Carrito;
import proyectoapi.model.ItemCarrito;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.model.Usuario;
import proyectoapi.repository.CarritoRepository;
import proyectoapi.repository.ProductoEnVentaRepository;
import proyectoapi.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;

@Service
@Transactional
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoEnVentaRepository productoEnVentaRepository;

    public Carrito getCartByUser(Long usuarioId) {
        // Busca usuarios por el id que aparece en el repositorio del carrito
        return carritoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> {
                    // si no lo encuentra en el repo de carrito, va a buscar en el repo de usuarios
                    Usuario usuario = usuarioRepository.findById(usuarioId)
                            // TODO: crear una excepcion para usuario no encontrado
                            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
                    // si encuentra el usuario, crea un nuevo carrito y se lo asigna y lo guarda en
                    // relacion al usuario
                    Carrito nuevoCarrito = new Carrito();
                    nuevoCarrito.setUsuario(usuario);
                    return carritoRepository.save(nuevoCarrito);
                });
    }

    public Carrito addProductCart(Long productoId, Long usuarioId, int cantidad) {
        // primero busca el carrito del usuario llamando la funcion de arriba
        Carrito carrito = getCartByUser(usuarioId);

        // busca el producto en venta
        ProductoEnVenta productoVenta = productoEnVentaRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto en venta no encontrado"));

        // crea una validacion de stock
        if (productoVenta.getStock() < cantidad) {
            throw new RuntimeException("No hay stock suficiente para este producto");
        }

        // Busca si el producto ya está en el carrito y si existe incrementa la cantidad
        Optional<ItemCarrito> itemExistente = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(productoId))
                .findFirst();

        if (itemExistente.isPresent()) {
            itemExistente.get().setCantidad(itemExistente.get().getCantidad() + cantidad);
        } else {
            ItemCarrito nuevoItem = new ItemCarrito();
            nuevoItem.setProducto(productoVenta);
            nuevoItem.setCantidad(cantidad);
            carrito.getItems().add(nuevoItem);
        }

        // se guarda el carrito en el repository de carritos
        return carritoRepository.save(carrito);
    }
}
