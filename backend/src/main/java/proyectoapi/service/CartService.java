package proyectoapi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import proyectoapi.dto.CartResponseDTO;
import proyectoapi.dto.CartItemResponseDTO;
import proyectoapi.model.Cart;
import proyectoapi.model.CartItem;
import proyectoapi.model.SaleProduct;
import proyectoapi.model.User;
import proyectoapi.repository.CartRepository;
import proyectoapi.repository.SaleProductRepository;
import proyectoapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

import proyectoapi.exception.BusinessLogicException;
import proyectoapi.exception.ResourceNotFoundException;

/** Gestiona el cart de compras de los users */
@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SaleProductRepository saleProductRepository;

    /** Obtiene el cart de un user autenticado como DTO */
    public CartResponseDTO getCartByUser(String email) {
        return mapToDTO(getCartEntityByEmail(email));
    }

    /** Busca o crea la entidad Cart de un user por su email */
    private Cart getCartEntityByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResourceNotFoundException("User no encontrado");
        }
        return cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart nuevoCart = new Cart();
                    nuevoCart.setUser(user);
                    return cartRepository.save(nuevoCart);
                });
    }

    /** Agrega un product al cart validando stock */
    public CartResponseDTO addProductCart(Long productId, String email, int quantity) {
        Cart cart = getCartEntityByEmail(email);

        // busca el product en sale
        SaleProduct productSale = saleProductRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product en sale no encontrado"));

        // Busca si el product ya está en el cart
        Optional<CartItem> itemExistente = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        // Calculamos la quantity total que habrá en el cart si agregamos esto
        int quantityTotal = itemExistente.isPresent() ? itemExistente.get().getQuantity() + quantity : quantity;

        // crea una validacion de stock
        if (productSale.getStock() < quantityTotal) {
            throw new BusinessLogicException("No hay stock suficiente para este product");
        }

        if (itemExistente.isPresent()) {
            itemExistente.get().setQuantity(quantityTotal);
        } else {
            CartItem nuevoItem = new CartItem();
            nuevoItem.setProduct(productSale);
            nuevoItem.setQuantity(quantity);
            cart.getItems().add(nuevoItem);
        }

        // se guarda el cart en el repository de carts
        Cart cartGuardado = cartRepository.save(cart);
        return mapToDTO(cartGuardado);
    }

    /** Actualiza la quantity de un product en el cart */
    public CartResponseDTO updateProductQuantity(Long productId, String email, int nuevaQuantity) {
        Cart cart = getCartEntityByEmail(email);

        // busca el product en el cart
        Optional<CartItem> itemExistente = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        // si existe el product en el cart y nueva quantity es menor a 0 elimina el
        // product del cart
        // si no existe el product en el cart lanza una excepcion
        if (itemExistente.isPresent()) {
            if (nuevaQuantity <= 0) {
                cart.getItems().remove(itemExistente.get());
            } else {
                SaleProduct productSale = itemExistente.get().getProduct();
                if (productSale.getStock() < nuevaQuantity) {
                    throw new BusinessLogicException("No hay stock suficiente para este product");
                }
                itemExistente.get().setQuantity(nuevaQuantity);
            }
        } else {
            throw new BusinessLogicException("El product no está en el cart");
        }

        return mapToDTO(cartRepository.save(cart));
    }

    /** Elimina un product específico del cart */
    public CartResponseDTO removeProductFromCart(Long productId, String email) {
        Cart cart = getCartEntityByEmail(email);

        // delete product del cart si el product seleccionado tiene el mismo id
        // del product a delete
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        return mapToDTO(cartRepository.save(cart));
    }

    /** Vacía all los products del cart del user */
    public CartResponseDTO emptyCart(String email) {
        Cart cart = getCartEntityByEmail(email);

        // funcion para clear cart
        cart.getItems().clear();
        return mapToDTO(cartRepository.save(cart));
    }

    /** Convierte un CartItem a su versión DTO */
    private CartItemResponseDTO mapItemToDTO(CartItem item) {
        CartItemResponseDTO dto = new CartItemResponseDTO();
        dto.setId(item.getId());
        dto.setProductId(item.getProduct().getId());
        dto.setNameProduct(item.getProduct().getProduct().getTitulo());
        dto.setQuantity(item.getQuantity());

        // Convertimos el Integer del price a Double para el DTO
        Double price = item.getProduct().getPrice().doubleValue();
        dto.setPriceUnitario(price);

        // Calculamos el subtotal asegurando que sea un Double
        dto.setSubtotal(price * item.getQuantity());

        return dto;
    }

    /** Convierte la entidad Cart a CartResponseDTO */
    private CartResponseDTO mapToDTO(Cart cart) {
        CartResponseDTO dto = new CartResponseDTO();
        dto.setId(cart.getId());
        dto.setUserId(cart.getUser().getId());

        List<CartItemResponseDTO> itemsDTO = cart.getItems().stream()
                .map(this::mapItemToDTO)
                .collect(Collectors.toList());
        dto.setItems(itemsDTO);

        double total = itemsDTO.stream()
                .mapToDouble(CartItemResponseDTO::getSubtotal)
                .sum();
        dto.setTotal(total);

        return dto;
    }

}
