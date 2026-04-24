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
    public VentaResponseDTO checkout(VentaRequestDTO request) {
        // 1. Obtener usuario
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        // 2. Obtener carrito
        Carrito carrito = carritoRepository.findByUsuarioId(request.getUsuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Carrito no encontrado"));

        if (carrito.getItems().isEmpty()) {
            throw new BusinessLogicException("El carrito está vacío");
        }

        // 3. Crear cabecera de Venta
        Venta venta = new Venta();
        venta.setUsuario(usuario);
        venta.setFechaVenta(LocalDateTime.now());
        
        double total = 0.0;
        List<CompraProducto> compras = new ArrayList<>();

        // 4. Validar stock y generar detalles
        for (ItemCarrito item : carrito.getItems()) {
            ProductoEnVenta productoVenta = item.getProducto();
            
            if (productoVenta.getStock() < item.getCantidad()) {
                throw new BusinessLogicException("No hay stock suficiente para el producto: " + productoVenta.getProducto().getTitulo());
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
    
    /** Recupera el historial de compras de un usuario específico */
    public List<VentaResponseDTO> obtenerVentasPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
                
        List<Venta> ventas = ventaRepository.findByUsuarioOrderByFechaVentaDesc(usuario);
        
        return ventas.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    /** Convierte la entidad Venta a un objeto VentaResponseDTO */
    private VentaResponseDTO mapToDTO(Venta venta) {
        VentaResponseDTO dto = new VentaResponseDTO();
        dto.setVentaId(venta.getId());
        dto.setUsuarioId(venta.getUsuario().getId());
        dto.setTotalPagado(venta.getTotal());
        dto.setFechaVenta(venta.getFechaVenta());
        dto.setMensaje("Compra realizada con éxito");
        
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
}
