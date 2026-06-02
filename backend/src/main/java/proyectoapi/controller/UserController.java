package proyectoapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyectoapi.dto.UpdatePriceDTO;
import proyectoapi.dto.ProductResponseDTO;
import proyectoapi.dto.PublicationDTO;
import proyectoapi.dto.UserRequestDTO;
import proyectoapi.dto.UserResponseDTO;
import proyectoapi.model.User;
import proyectoapi.service.UserService;

/** Endpoints para gestión de users y acciones de vendedores */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    /** Obtiene la lista de all los vendedores registrados */
    @GetMapping("/vendedores")
    public ResponseEntity<List<UserResponseDTO>> getVendedores() {
        List<UserResponseDTO> vendedores = userService.getVendedores().stream()
                .map(this::mapToDTO)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(vendedores);
    }

    /** Permite a un vendedor publicar un nuevo product */
    @PostMapping("/product/publish")
    public ResponseEntity<ProductResponseDTO> publicar(@RequestBody PublicationDTO data) {
        // El user se resuelve internamente desde el JWT
        ProductResponseDTO dto = userService.publicarProduct(data.getTitulo(), data.getDescription(),
                data.getCategory(), data.getUrlImage(), data.getStock(), data.getPrice());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /** Elimina un product publicado por el vendedor */
    @DeleteMapping("/product/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        userService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    /** Actualiza parcialmente el price de un product publicado */
    @PatchMapping("/product/update")
    public ResponseEntity<Void> updatePriceProduct(@RequestBody UpdatePriceDTO updatePriceDTO) {
        // La validacion de propietario se hace internamente en el servicio
        userService.updatePriceProduct(updatePriceDTO.getPriceNuevo(), updatePriceDTO.getId());
        return ResponseEntity.noContent().build();
    }

    /** Actualiza el perfil del user autenticado */
    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateProfile(@RequestBody UserRequestDTO user) {
        return ResponseEntity.ok(userService.updateProfile(user));
    }

    /** Obtiene el perfil del user autenticado */
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    /** Convierte una entidad User a UserResponseDTO */
    private UserResponseDTO mapToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setApellido(user.getApellido());
        dto.setEmail(user.getEmail());
        return dto;
    }
}