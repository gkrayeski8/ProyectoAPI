package proyectoapi.repository;

import proyectoapi.model.Usuario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    public Usuario findByEmail(String email);

    @Query("SELECT u FROM Usuario u WHERE u.role = proyectoapi.model.Role.VENDEDOR AND EXISTS (SELECT 1 FROM ProductoEnVenta p WHERE p.usuario = u)")
    public List<Usuario> findVendedores();
}
