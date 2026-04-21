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
//import proyectoapi.dto.LoginDTO;
//import proyectoapi.dto.ProductoResponseDTO;
import proyectoapi.dto.PublicacionDTO;
//import proyectoapi.dto.UsuarioRequestDTO;
import proyectoapi.dto.UsuarioResponseDTO;
//import proyectoapi.model.Producto;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.model.Usuario;
import proyectoapi.service.UsuarioService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("/vendedores")
    public List<Usuario> obtenerVendedores() {
        return usuarioService.getVendedores();
    }

    // TODO: Agregar endpoint para obtener vendedor por id
    // TODO: agregar endpoint para obtener compradores
    // TODO: agregar endpoint para obtener compradores por id

    @PostMapping("/product/publish")
    public ProductoEnVenta publicar(@RequestBody PublicacionDTO data) {
        return usuarioService.publicarProducto(data.getTitulo(), data.getDescripcion(), data.getCategoria(),
                data.getUrlImagen(), data.getUsuarioId(), data.getStock(), data.getPrecio());
    }

    @DeleteMapping("/product/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        usuarioService.eliminarProducto(id);
    }

    @PatchMapping("/product/update")
    public void actualizarPrecioProducto(@RequestBody ActualizarPrecioDTO actualizarPrecioDTO) {
        usuarioService.updatePrecioProducto(actualizarPrecioDTO.getPrecioNuevo(), actualizarPrecioDTO.getUsuarioId(),
                actualizarPrecioDTO.getId());
    }

    private UsuarioResponseDTO mapToDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setApellido(usuario.getApellido());
        dto.setEmail(usuario.getEmail());
        return dto;
    }
}
