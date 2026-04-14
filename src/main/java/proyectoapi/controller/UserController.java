package proyectoapi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import proyectoapi.model.Usuario;
import proyectoapi.service.UsuarioService;

@RestController
@RequestMapping("/api/auth")
public class UserController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @PostMapping("/register")
    public Usuario registrarUsuario(@RequestBody Usuario usuario){
        return usuarioService.createUser(
            usuario.getNombre(),
            usuario.getApellido(),
            usuario.getEmail(),
            usuario.getPassword()
        );
    }

}
