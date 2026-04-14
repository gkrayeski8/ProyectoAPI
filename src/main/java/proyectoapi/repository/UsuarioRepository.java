package proyectoapi.repository;

import proyectoapi.model.Usuario;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    public Usuario findByEmail(String email);

    @Query("SELECT DISTINCT u FROM Usuario u JOIN u.productosEnVenta p")
    public List<Usuario> findVendedores();
}
