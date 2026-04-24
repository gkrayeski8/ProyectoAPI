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

import proyectoapi.dto.ActualizarPrecioDTO;
import proyectoapi.dto.ProductoResponseDTO;
import proyectoapi.dto.PublicacionDTO;
import proyectoapi.dto.UsuarioRequestDTO;
import proyectoapi.dto.UsuarioResponseDTO;
import proyectoapi.model.Usuario;
import proyectoapi.service.UsuarioService;

/** Endpoints para gestión de usuarios y acciones de vendedores */
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UsuarioService usuarioService;

    /** Obtiene la lista de todos los vendedores registrados */
    @GetMapping("/vendedores")
    public ResponseEntity<List<UsuarioResponseDTO>> obtenerVendedores() {
        List<UsuarioResponseDTO> vendedores = usuarioService.getVendedores().stream()
                .map(this::mapToDTO)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(vendedores);
    }

    // TODO: Agregar endpoint para obtener vendedor por id
    // TODO: agregar endpoint para obtener compradores
    // TODO: agregar endpoint para obtener compradores por id

    /** Permite a un vendedor publicar un nuevo producto */
    @PostMapping("/product/publish")
    public ResponseEntity<ProductoResponseDTO> publicar(@RequestBody PublicacionDTO data) {
        // El usuario se resuelve internamente desde el JWT
        ProductoResponseDTO dto = usuarioService.publicarProducto(data.getTitulo(), data.getDescripcion(),
                data.getCategoria(), data.getUrlImagen(), data.getStock(), data.getPrecio());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /** Elimina un producto publicado por el vendedor */
    @DeleteMapping("/product/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        usuarioService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    /** Actualiza parcialmente el precio de un producto publicado */
    @PatchMapping("/product/update")
    public ResponseEntity<Void> actualizarPrecioProducto(@RequestBody ActualizarPrecioDTO actualizarPrecioDTO) {
        // La validacion de propietario se hace internamente en el servicio
        usuarioService.updatePrecioProducto(actualizarPrecioDTO.getPrecioNuevo(), actualizarPrecioDTO.getId());
        return ResponseEntity.noContent().build();
    }

    /** Actualiza el perfil del usuario autenticado */
    @PutMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> updateProfile(@RequestBody UsuarioRequestDTO usuario) {
        return ResponseEntity.ok(usuarioService.updateProfile(usuario));
    }

    /** Obtiene el perfil del usuario autenticado */
    @GetMapping("/me")
    public ResponseEntity<UsuarioResponseDTO> getMyProfile() {
        return ResponseEntity.ok(usuarioService.getMyProfile());
    }

    /** Convierte una entidad Usuario a UsuarioResponseDTO */
    private UsuarioResponseDTO mapToDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        return dto;
    }
}