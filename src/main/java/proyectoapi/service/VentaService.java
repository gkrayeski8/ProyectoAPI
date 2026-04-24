package proyectoapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import proyectoapi.dto.CompraProductoResponseDTO;
import proyectoapi.dto.VentaRequestDTO;
import proyectoapi.dto.VentaResponseDTO;
import proyectoapi.model.Carrito;
import proyectoapi.model.CompraProducto;
import proyectoapi.model.ItemCarrito;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.model.Usuario;
import proyectoapi.model.Venta;
import proyectoapi.repository.CarritoRepository;
import proyectoapi.repository.ProductoEnVentaRepository;
import proyectoapi.repository.UsuarioRepository;
import proyectoapi.repository.VentaRepository;
import proyectoapi.exception.BusinessLogicException;
import proyectoapi.exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/** Procesa órdenes de compra, valida stock y vacía carritos */
@Service
@Transactional
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private CarritoRepository carritoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ProductoEnVentaRepository productoEnVentaRepository;

    /** Procesa el pago, descuenta stock y genera la venta */
    public VentaResponseDTO checkout(String email, VentaRequestDTO request) {
        // 1. Obtener usuario desde el JWT
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }

        // 2. Obtener carrito
        Carrito carrito = carritoRepository.findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado"));

        if (carrito.getItems().isEmpty()) {
            throw new BusinessLogicException("El carrito está vacío");
        }

        // 3. Crear cabecera de Venta
        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setFechaVenta(LocalDateTime.now());
        venta.setDireccionEnvio(request.getDireccionEnvio());
        venta.setMetodoPago(request.getMetodoPago());

        double total = 0.0;
        List<CompraProducto> compras = new ArrayList<>();

        // 4. Validar stock y generar detalles
        for (ItemCarrito item : carrito.getItems()) {
            ProductoEnVenta productoVenta = item.getProducto();

            if (!productoVenta.isActivo()) {
                throw new BusinessLogicException(
                        "El producto '" + productoVenta.getProducto().getTitulo() + "' ya no está disponible para la venta.");
            }

            if (productoVenta.getStock() < item.getCantidad()) {
                throw new BusinessLogicException(
                        "No hay stock suficiente para el producto: " + productoVenta.getProducto().getTitulo());
            }

            // Descontar stock
            productoVenta.setStock(productoVenta.getStock() - item.getCantidad());
            productoEnVentaRepository.save(productoVenta);

            // Crear registro de CompraProducto
            CompraProducto compra = new CompraProducto();
            compra.setUsuario(usuario);
            compra.setProducto(productoVenta);
            compra.setCantidad(item.getCantidad());
            compra.setFechaCompra(LocalDateTime.now());
            compra.setPrecioUnitario(productoVenta.getPrecio().doubleValue());
            compra.setVenta(venta);

            compras.add(compra);
            total += (compra.getPrecioUnitario() * compra.getCantidad());
        }

        venta.setItems(compras);
        venta.setTotal(total);

        // 5. Guardar venta (y por cascade las compras)
        Venta ventaGuardada = ventaRepository.save(venta);

        // 6. Vaciar carrito
        carrito.getItems().clear();
        carritoRepository.save(carrito);

        // 7. Mapear respuesta
        return mapToDTO(ventaGuardada);
    }

    /** Recupera el historial de compras del usuario autenticado */
    public List<VentaResponseDTO> obtenerVentasPorUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        if (usuario == null) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
        List<Venta> ventas = ventaRepository.findByUsuarioOrderByFechaVentaDesc(usuario);
        return ventas.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    /** Recupera el historial de ventas (productos vendidos) por el vendedor autenticado */
    public List<VentaResponseDTO> obtenerVentasDeMisProductos(String email) {
        Usuario vendedor = usuarioRepository.findByEmail(email);
        if (vendedor == null) {
            throw new ResourceNotFoundException("Usuario no encontrado");
        }
        
        List<Venta> ventas = ventaRepository.findVentasByVendedor(vendedor);
        
        return ventas.stream().map(venta -> {
            VentaResponseDTO dto = new VentaResponseDTO();
            dto.setVentaId(venta.getId());
            dto.setUsuarioId(venta.getUsuario().getId()); // El comprador
            dto.setFechaVenta(venta.getFechaVenta());
            dto.setDireccionEnvio(venta.getDireccionEnvio());
            dto.setMetodoPago(venta.getMetodoPago());
            
            // Solo incluir los productos de este vendedor en el ticket
            List<CompraProductoResponseDTO> itemsDTO = venta.getItems().stream()
                .filter(compra -> compra.getProducto().getUsuario().getId().equals(vendedor.getId()))
                .map(compra -> {
                    CompraProductoResponseDTO item = new CompraProductoResponseDTO();
                    item.setProductoId(compra.getProducto().getId());
                    item.setTituloProducto(compra.getProducto().getProducto().getTitulo());
                    item.setCantidad(compra.getCantidad());
                    item.setPrecioUnitario(compra.getPrecioUnitario());
                    return item;
                }).collect(Collectors.toList());
            
            dto.setItems(itemsDTO);
            
            // Recalcular el total solo con la suma de los productos de este vendedor
            double totalVendedor = itemsDTO.stream().mapToDouble(i -> i.getPrecioUnitario() * i.getCantidad()).sum();
            dto.setTotalPagado(totalVendedor);
            dto.setMensaje("Detalle de mis productos vendidos");
            
            return dto;
        }).collect(Collectors.toList());
    }

    /** Convierte la entidad Venta a un objeto VentaResponseDTO */
    private VentaResponseDTO mapToDTO(Venta venta) {
        VentaResponseDTO dto = new VentaResponseDTO();
        dto.setVentaId(venta.getId());
        dto.setUsuarioId(venta.getUsuario().getId());
        dto.setTotalPagado(venta.getTotal());
        dto.setFechaVenta(venta.getFechaVenta());
        dto.setMensaje("Compra realizada con éxito");
        dto.setDireccionEnvio(venta.getDireccionEnvio());
        dto.setMetodoPago(venta.getMetodoPago());

        List<CompraProductoResponseDTO> itemsDTO = venta.getItems().stream().map(compra -> {
            CompraProductoResponseDTO item = new CompraProductoResponseDTO();
            item.setProductoId(compra.getProducto().getId());
            item.setTituloProducto(compra.getProducto().getProducto().getTitulo());
            item.setCantidad(compra.getCantidad());
            item.setPrecioUnitario(compra.getPrecioUnitario());
            return item;
        }).collect(Collectors.toList());

        dto.setItems(itemsDTO);
        return dto;
    }

    public VentaResponseDTO obtenerVentaPorId(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venta no encontrada"));
        return mapToDTO(venta);
    }
}
