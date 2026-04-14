package proyectoapi.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyectoapi.dto.PublicacionDTO;
//import proyectoapi.model.Producto;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.model.Usuario;
import proyectoapi.service.UsuarioService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/auth/register")
    public Usuario registrarUsuario(@RequestBody Usuario usuario) {
        return usuarioService.createUser(
                usuario.getNombre(),
                usuario.getApellido(),
                usuario.getEmail(),
                usuario.getPassword());
    }

    @GetMapping("/vendedores")
    public List<Usuario> obtenerVendedores() {
        return usuarioService.getVendedores();
    }

    @PostMapping("/product/publish")
    public ProductoEnVenta publicar(@RequestBody PublicacionDTO data) {
        return usuarioService.publicarProducto(data.getProducto(), data.getUsuarioId(), data.getStock());
    }
}
