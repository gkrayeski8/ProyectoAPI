package proyectoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.model.Usuario;
import java.util.List;

public interface ProductoEnVentaRepository extends JpaRepository<ProductoEnVenta, Long> {
    
    List<ProductoEnVenta> findByUsuario(Usuario usuario);
    
    List<ProductoEnVenta> findByUsuarioAndStockGreaterThan(Usuario usuario, int stock);
    
    ProductoEnVenta findByUsuarioAndProductoId(Usuario usuario, Long productoId);

    List<ProductoEnVenta> findAllByOrderByProductoTituloAsc();
}
