package proyectoapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyectoapi.dto.ActualizarPrecioDTO;
import proyectoapi.dto.ProductoResponseDTO;
import proyectoapi.dto.PublicacionDTO;
import proyectoapi.dto.UsuarioResponseDTO;
import proyectoapi.model.ProductoEnVenta;
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
    public List<UsuarioResponseDTO> obtenerVendedores() {
        return usuarioService.getVendedores().stream()
                .map(this::mapToDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    // TODO: Agregar endpoint para obtener vendedor por id
    // TODO: agregar endpoint para obtener compradores
    // TODO: agregar endpoint para obtener compradores por id

    /** Permite a un vendedor publicar un nuevo producto */
    @PostMapping("/product/publish")
    public ProductoResponseDTO publicar(@RequestBody PublicacionDTO data) {
        usuarioService.validarPropietario(data.getUsuarioId());
        return usuarioService.publicarProducto(data.getTitulo(), data.getDescripcion(), data.getCategoria(),
                data.getUrlImagen(), data.getUsuarioId(), data.getStock(), data.getPrecio());
    }

    /** Elimina un producto publicado por el vendedor */
    @DeleteMapping("/product/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        usuarioService.eliminarProducto(id);
    }

    /** Actualiza parcialmente el precio de un producto publicado */
    @PatchMapping("/product/update")
    public void actualizarPrecioProducto(@RequestBody ActualizarPrecioDTO actualizarPrecioDTO) {
        usuarioService.validarPropietario(actualizarPrecioDTO.getUsuarioId());
        usuarioService.updatePrecioProducto(actualizarPrecioDTO.getPrecioNuevo(), actualizarPrecioDTO.getUsuarioId(),
                actualizarPrecioDTO.getId());
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
