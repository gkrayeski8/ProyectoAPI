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

import proyectoapi.exception.BusinessLogicException;
import proyectoapi.exception.ResourceNotFoundException;

/** Gestiona el carrito de compras de los usuarios */
@Service
@Transactional
public class CarritoService {

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoEnVentaRepository productoEnVentaRepository;

    /** Obtiene el carrito de un usuario autenticado como DTO */
    public CarritoResponseDTO getCartByUser(String email) {
        return mapToDTO(getCartEntityByEmail(email));
    }

    /** Busca o crea la entidad Carrito de un usuario por su email */
    private Carrito getCartEntityByEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
        return carritoRepository.findByUsuarioId(usuario.getId())
                .orElseGet(() -> {
                    Carrito nuevoCarrito = new Carrito();
                    nuevoCarrito.setUsuario(usuario);
                    return carritoRepository.save(nuevoCarrito);
                });
    }

    /** Agrega un producto al carrito validando stock */
    public CarritoResponseDTO addProductCart(Long productoId, String email, int cantidad) {
        Carrito carrito = getCartEntityByEmail(email);

        // busca el producto en venta
        ProductoEnVenta productoVenta = productoEnVentaRepository.findById(productoId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto en venta no encontrado"));

        // crea una validacion de stock
        if (productoVenta.getStock() < cantidad) {
            throw new BusinessLogicException("No hay stock suficiente para este producto");
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

    /** Actualiza la cantidad de un producto en el carrito */
    public CarritoResponseDTO updateProductQuantity(Long productoId, String email, int nuevaCantidad) {
        Carrito carrito = getCartEntityByEmail(email);

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
                    throw new BusinessLogicException("No hay stock suficiente para este producto");
                }
                itemExistente.get().setCantidad(nuevaCantidad);
            }
        } else {
            throw new BusinessLogicException("El producto no está en el carrito");
        }

        return mapToDTO(carritoRepository.save(carrito));
    }

    /** Elimina un producto específico del carrito */
    public CarritoResponseDTO removeProductFromCart(Long productoId, String email) {
        Carrito carrito = getCartEntityByEmail(email);

        // eliminar producto del carrito si el producto seleccionado tiene el mismo id
        // del producto a eliminar
        carrito.getItems().removeIf(item -> item.getProducto().getId().equals(productoId));
        return mapToDTO(carritoRepository.save(carrito));
    }

    /** Vacía todos los productos del carrito del usuario */
    public CarritoResponseDTO emptyCart(String email) {
        Carrito carrito = getCartEntityByEmail(email);

        // funcion para vaciar carrito
        carrito.getItems().clear();
        return mapToDTO(carritoRepository.save(carrito));
    }

    /** Convierte un ItemCarrito a su versión DTO */
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

    /** Convierte la entidad Carrito a CarritoResponseDTO */
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
