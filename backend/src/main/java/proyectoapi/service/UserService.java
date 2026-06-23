package proyectoapi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import proyectoapi.dto.ProductResponseDTO;
import proyectoapi.dto.UserRequestDTO;
import proyectoapi.dto.UserResponseDTO;
import proyectoapi.model.Product;
import proyectoapi.model.SaleProduct;
import proyectoapi.model.User;
import proyectoapi.repository.SaleProductRepository;
import proyectoapi.repository.ProductRepository;
import proyectoapi.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import proyectoapi.exception.ResourceNotFoundException;
import proyectoapi.exception.BusinessLogicException;
import proyectoapi.model.Role;

/** Gestiona users, perfiles, login y publicationes de vendedores */
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final SaleProductRepository saleProductRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, SaleProductRepository saleProductRepository,
            ProductRepository productRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.saleProductRepository = saleProductRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** Crea un nuevo user en el sistema */
    public UserResponseDTO createUser(String name, String apellido, String email, String password, Role role) {
        // Verificacion de que el email no exista
        if (userRepository.findByEmail(email) != null) {
            throw new BusinessLogicException("Error: El email ya existe");
        }

        // Creacion del user
        User user = new User();
        user.setName(name);
        user.setApellido(apellido);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        // Evitar que el user se asigne el rol de ADMIN maliciosamente
        user.setRole(role != null && role != Role.ADMIN ? role : Role.COMPRADOR);
        User saved = userRepository.save(user);

        UserResponseDTO response = new UserResponseDTO();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setApellido(saved.getApellido());
        response.setEmail(saved.getEmail());
        response.setRole(saved.getRole());
        return response;
    }

    /** Obtiene el user actualmente autenticado desde el JWT */
    public User getUserAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser")) {
            return userRepository.findByEmail(auth.getName());
        }
        return null;
    }

    /** Valida que el ID enviado coincida con el user autenticado */
    public void validarPropietario(Long idUserEnviado) {
        User authUser = getUserAutenticado();
        if (authUser == null || !authUser.getId().equals(idUserEnviado)) {
            throw new AccessDeniedException("No tienes permisos para acceder o modificar recursos de otro user");
        }
    }

    /** Lista all los users con rol VENDEDOR */
    public List<User> getVendedores() {
        return userRepository.findVendedores();
    }

    /** Permite a un vendedor publicar un nuevo product */
    public ProductResponseDTO publicarProduct(String titulo, String description, String category, String urlImage,
            Integer stock, Double price) {
        User user = getUserAutenticado();
        if (user == null) {
            throw new ResourceNotFoundException("User autenticado no encontrado");
        }
        Product product = createProduct(titulo, description, category, urlImage);
        SaleProduct nuevoProductSale = new SaleProduct();
        nuevoProductSale.setUser(user);
        nuevoProductSale.setProduct(product);
        nuevoProductSale.setStock(stock);
        nuevoProductSale.setPrice(price);
        user.getProductsEnSale().add(nuevoProductSale);
        SaleProduct saved = saleProductRepository.save(nuevoProductSale);

        ProductResponseDTO response = new ProductResponseDTO();
        response.setId(saved.getId());
        response.setTitulo(saved.getProduct().getTitulo());
        response.setDescription(saved.getProduct().getDescription());
        response.setCategory(saved.getProduct().getCategory());
        response.setUrlImage(saved.getProduct().getUrlImage());
        response.setPrice(saved.getPrice());
        response.setStock(saved.getStock());
        response.setVendedor(user.getName() + " " + user.getApellido());

        return response;
    }

    /** Realiza un borrado lógico de una publicación de product por su ID */
    public void deleteProduct(Long id) {
        SaleProduct product = saleProductRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product en sale no encontrado con ID: " + id));

        validarPropietario(product.getUser().getId());

        product.setActivo(false);
        saleProductRepository.save(product);
    }

    /** Actualiza el price de un product si pertenece al user autenticado */
    public void updatePriceProduct(Double priceNuevo, Long id) {
        SaleProduct product = saleProductRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product no encontrado con ID: " + id));

        // Valida que el product pertenezca al user del JWT
        validarPropietario(product.getUser().getId());

        product.setPrice(priceNuevo);
        saleProductRepository.save(product);
    }

    /** Crea y persiste un objeto Product base */
    private Product createProduct(String titulo, String description, String category, String urlImage) {
        Product product = new Product();
        product.setTitulo(titulo);
        product.setCategory(category);
        product.setDescription(description);
        product.setUrlImage(urlImage);
        return productRepository.save(product);
    }

    /** Actualiza el perfil del user autenticado */
    public UserResponseDTO updateProfile(UserRequestDTO user) {
        User authUser = getUserAutenticado();
        if (authUser == null) {
            throw new AccessDeniedException("No tienes permisos para acceder al perfil");
        }

        if (user.getName() != null && !user.getName().isEmpty()) {
            authUser.setName(user.getName());
        }
        if (user.getApellido() != null && !user.getApellido().isEmpty()) {
            authUser.setApellido(user.getApellido());
        }
        if (user.getEmail() != null && !user.getEmail().isEmpty()) {
            // Validar que el nuevo email no esté en uso por otro user
            User existente = userRepository.findByEmail(user.getEmail());
            if (existente != null && !existente.getId().equals(authUser.getId())) {
                throw new BusinessLogicException("El email ya está en uso por otro user");
            }
            authUser.setEmail(user.getEmail());
        }
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            authUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        User saved = userRepository.save(authUser);

        UserResponseDTO response = new UserResponseDTO();
        response.setId(saved.getId());
        response.setName(saved.getName());
        response.setApellido(saved.getApellido());
        response.setEmail(saved.getEmail());
        response.setRole(saved.getRole());
        return response;
    }

    /** Obtiene el perfil del user autenticado */
    public UserResponseDTO getMyProfile() {
        User authUser = getUserAutenticado();
        if (authUser == null) {
            throw new AccessDeniedException("No tienes permisos para acceder al perfil");
        }
        UserResponseDTO response = new UserResponseDTO();
        response.setId(authUser.getId());
        response.setName(authUser.getName());
        response.setApellido(authUser.getApellido());
        response.setEmail(authUser.getEmail());
        response.setRole(authUser.getRole());
        return response;
    }
}
