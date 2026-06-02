package proyectoapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import proyectoapi.dto.PurchaseItemResponseDTO;
import proyectoapi.dto.SaleRequestDTO;
import proyectoapi.dto.SaleResponseDTO;
import proyectoapi.model.Cart;
import proyectoapi.model.PurchaseItem;
import proyectoapi.model.CartItem;
import proyectoapi.model.SaleProduct;
import proyectoapi.model.User;
import proyectoapi.model.Sale;
import proyectoapi.repository.CartRepository;
import proyectoapi.repository.SaleProductRepository;
import proyectoapi.repository.UserRepository;
import proyectoapi.repository.SaleRepository;
import proyectoapi.exception.BusinessLogicException;
import proyectoapi.exception.ResourceNotFoundException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/** Procesa órdenes de compra, valida stock y vacía carts */
@Service
@Transactional
public class SaleService {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SaleProductRepository saleProductRepository;

    /** Procesa el pago, descuenta stock y genera la sale */
    public SaleResponseDTO checkout(String email, SaleRequestDTO request) {
        // 1. Get user desde el JWT
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User no encontrado");
        }

        // 2. Get cart
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart no encontrado"));

        if (cart.getItems().isEmpty()) {
            throw new BusinessLogicException("El cart está vacío");
        }

        // 3. Create cabecera de Sale
        Sale sale = new Sale();
        sale.setUser(user);
        sale.setFechaSale(LocalDateTime.now());
        sale.setDireccionEnvio(request.getDireccionEnvio());
        sale.setMetodoPago(request.getMetodoPago());

        double total = 0.0;
        List<PurchaseItem> compras = new ArrayList<>();

        // 4. Validar stock y generar detalles
        for (CartItem item : cart.getItems()) {
            SaleProduct productSale = item.getProduct();

            if (!productSale.isActivo()) {
                throw new BusinessLogicException(
                        "El product '" + productSale.getProduct().getTitulo() + "' ya no está disponible para la sale.");
            }

            if (productSale.getStock() < item.getQuantity()) {
                throw new BusinessLogicException(
                        "No hay stock suficiente para el product: " + productSale.getProduct().getTitulo());
            }

            // Descontar stock
            productSale.setStock(productSale.getStock() - item.getQuantity());
            saleProductRepository.save(productSale);

            // Create register de PurchaseItem
            PurchaseItem compra = new PurchaseItem();
            compra.setUser(user);
            compra.setProduct(productSale);
            compra.setQuantity(item.getQuantity());
            compra.setFechaCompra(LocalDateTime.now());
            compra.setPriceUnitario(productSale.getPrice().doubleValue());
            compra.setSale(sale);

            compras.add(compra);
            total += (compra.getPriceUnitario() * compra.getQuantity());
        }

        sale.setItems(compras);
        sale.setTotal(total);

        // 5. Save sale (y por cascade las compras)
        Sale saleGuardada = saleRepository.save(sale);

        // 6. Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        // 7. Mapear respuesta
        return mapToDTO(saleGuardada);
    }

    /** Recupera el historial de compras del user autenticado */
    public List<SaleResponseDTO> getSalesPorUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User no encontrado");
        }
        List<Sale> sales = saleRepository.findByUserOrderByFechaSaleDesc(user);
        return sales.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    /** Recupera el historial de sales (products vendidos) por el vendedor autenticado */
    public List<SaleResponseDTO> getSalesDeMisProducts(String email) {
        User vendedor = userRepository.findByEmail(email);
        if (vendedor == null) {
            throw new ResourceNotFoundException("User no encontrado");
        }
        
        List<Sale> sales = saleRepository.findSalesByVendedor(vendedor);
        
        return sales.stream().map(sale -> {
            SaleResponseDTO dto = new SaleResponseDTO();
            dto.setSaleId(sale.getId());
            dto.setUserId(sale.getUser().getId()); // El comprador
            dto.setFechaSale(sale.getFechaSale());
            dto.setDireccionEnvio(sale.getDireccionEnvio());
            dto.setMetodoPago(sale.getMetodoPago());
            
            // Solo incluir los products de este vendedor en el ticket
            List<PurchaseItemResponseDTO> itemsDTO = sale.getItems().stream()
                .filter(compra -> compra.getProduct().getUser().getId().equals(vendedor.getId()))
                .map(compra -> {
                    PurchaseItemResponseDTO item = new PurchaseItemResponseDTO();
                    item.setProductId(compra.getProduct().getId());
                    item.setTituloProduct(compra.getProduct().getProduct().getTitulo());
                    item.setQuantity(compra.getQuantity());
                    item.setPriceUnitario(compra.getPriceUnitario());
                    return item;
                }).collect(Collectors.toList());
            
            dto.setItems(itemsDTO);
            
            // Recalcular el total solo con la suma de los products de este vendedor
            double totalVendedor = itemsDTO.stream().mapToDouble(i -> i.getPriceUnitario() * i.getQuantity()).sum();
            dto.setTotalPagado(totalVendedor);
            dto.setMensaje("Detalle de mis products vendidos");
            
            return dto;
        }).collect(Collectors.toList());
    }

    /** Convierte la entidad Sale a un objeto SaleResponseDTO */
    private SaleResponseDTO mapToDTO(Sale sale) {
        SaleResponseDTO dto = new SaleResponseDTO();
        dto.setSaleId(sale.getId());
        dto.setUserId(sale.getUser().getId());
        dto.setTotalPagado(sale.getTotal());
        dto.setFechaSale(sale.getFechaSale());
        dto.setMensaje("Compra realizada con éxito");
        dto.setDireccionEnvio(sale.getDireccionEnvio());
        dto.setMetodoPago(sale.getMetodoPago());

        List<PurchaseItemResponseDTO> itemsDTO = sale.getItems().stream().map(compra -> {
            PurchaseItemResponseDTO item = new PurchaseItemResponseDTO();
            item.setProductId(compra.getProduct().getId());
            item.setTituloProduct(compra.getProduct().getProduct().getTitulo());
            item.setQuantity(compra.getQuantity());
            item.setPriceUnitario(compra.getPriceUnitario());
            return item;
        }).collect(Collectors.toList());

        dto.setItems(itemsDTO);
        return dto;
    }

    public SaleResponseDTO getSaleById(Long id) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sale no encontrada"));
        return mapToDTO(sale);
    }
}
