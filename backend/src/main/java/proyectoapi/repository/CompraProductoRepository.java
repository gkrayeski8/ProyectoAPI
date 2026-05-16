package proyectoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import proyectoapi.model.CompraProducto;
import proyectoapi.model.Usuario;
import java.util.List;

public interface CompraProductoRepository extends JpaRepository<CompraProducto, Long> {
    
    // Obtener todas las compras de un usuario
    List<CompraProducto> findByUsuario(Usuario usuario);
    
    // Obtener compras de un usuario ordenadas por fecha (más recientes primero)
    List<CompraProducto> findByUsuarioOrderByFechaCompraDesc(Usuario usuario);
}