package proyectoapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proyectoapi.dto.CarritoResponseDTO;
import proyectoapi.dto.ItemCarritoResponseDTO;
import proyectoapi.model.Carrito;
import proyectoapi.model.ItemCarrito;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.model.Usuario;
import proyectoapi.repository.CarritoRepository;
import proyectoapi.repository.ProductoEnVentaRepository;
import proyectoapi.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoEnVentaRepository productoEnVentaRepository;

    public CarritoResponseDTO getCartByUser(Long usuarioId) {
        return mapToDTO(getCartEntityByUser(usuarioId));
    }

    private Carrito getCartEntityByUser(Long usuarioId) {
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

    public CarritoResponseDTO addProductCart(Long productoId, Long usuarioId, int cantidad) {
        // primero busca el carrito del usuario llamando la funcion de arriba
        Carrito carrito = getCartEntityByUser(usuarioId);

        // busca el producto en venta
        ProductoEnVenta productoVenta = productoEnVentaRepository.findById(productoId)
                // TODO: crear una excepcion para producto en venta no encontrado
                .orElseThrow(() -> new RuntimeException("Producto en venta no encontrado"));

        // crea una validacion de stock
        if (productoVenta.getStock() < cantidad) {
            // TODO: crear una excepcion para stock insuficiente
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
        Carrito carritoGuardado = carritoRepository.save(carrito);
        return mapToDTO(carritoGuardado);
    }

    public CarritoResponseDTO updateProductQuantity(Long productoId, Long usuarioId, int nuevaCantidad) {
        Carrito carrito = getCartEntityByUser(usuarioId);

        // busca el producto en el carrito
        Optional<ItemCarrito> itemExistente = carrito.getItems().stream()
                .filter(item -> item.getProducto().getId().equals(productoId))
                .findFirst();

        // si existe el producto en el carrito y nueva cantidad es menor a 0 elimina el
        // producto del carrito
        // si no existe el producto en el carrito lanza una excepcion
        if (itemExistente.isPresent()) {
            if (nuevaCantidad <= 0) {
                carrito.getItems().remove(itemExistente.get());
            } else {
                ProductoEnVenta productoVenta = itemExistente.get().getProducto();
                if (productoVenta.getStock() < nuevaCantidad) {
                    // TODO: usar excepcion de stock insuficiente
                    throw new IllegalStateException("No hay stock suficiente para este producto");
                }
                itemExistente.get().setCantidad(nuevaCantidad);
            }
        } else {
            // TODO: usar excepcion de producto no encontrado
            throw new IllegalArgumentException("El producto no está en el carrito");
        }

        return mapToDTO(carritoRepository.save(carrito));
    }

    public CarritoResponseDTO removeProductFromCart(Long productoId, Long usuarioId) {
        Carrito carrito = getCartEntityByUser(usuarioId);

        // eliminar producto del carrito si el producto seleccionado tiene el mismo id
        // del producto a eliminar
        carrito.getItems().removeIf(item -> item.getProducto().getId().equals(productoId));
        return mapToDTO(carritoRepository.save(carrito));
    }

    public CarritoResponseDTO emptyCart(Long usuarioId) {
        Carrito carrito = getCartEntityByUser(usuarioId);

        // funcion para vaciar carrito
        carrito.getItems().clear();
        return mapToDTO(carritoRepository.save(carrito));
    }

    private ItemCarritoResponseDTO mapItemToDTO(ItemCarrito item) {
        ItemCarritoResponseDTO dto = new ItemCarritoResponseDTO();
        dto.setId(item.getId());
        dto.setProductoId(item.getProducto().getId());
        dto.setNombreProducto(item.getProducto().getProducto().getTitulo());
        dto.setCantidad(item.getCantidad());

        // Convertimos el Integer del precio a Double para el DTO
        Double precio = item.getProducto().getPrecio().doubleValue();
        dto.setPrecioUnitario(precio);

        // Calculamos el subtotal asegurando que sea un Double
        dto.setSubtotal(precio * item.getCantidad());

        return dto;
    }

    private CarritoResponseDTO mapToDTO(Carrito carrito) {
        CarritoResponseDTO dto = new CarritoResponseDTO();
        dto.setId(carrito.getId());
        dto.setUsuarioId(carrito.getUsuario().getId());

        List<ItemCarritoResponseDTO> itemsDTO = carrito.getItems().stream()
                .map(this::mapItemToDTO)
                .collect(Collectors.toList());
        dto.setItems(itemsDTO);

        double total = itemsDTO.stream()
                .mapToDouble(ItemCarritoResponseDTO::getSubtotal)
                .sum();
        dto.setTotal(total);

        return dto;
    }

}
