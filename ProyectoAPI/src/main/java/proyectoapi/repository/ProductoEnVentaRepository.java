package proyectoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import proyectoapi.model.ProductoEnVenta;
import proyectoapi.model.Usuario;
import java.util.List;

public interface ProductoEnVentaRepository extends JpaRepository<ProductoEnVenta, Long> {
    
    List<ProductoEnVenta> findByUsuarioAndActivoTrue(Usuario usuario);
    
    List<ProductoEnVenta> findByUsuarioAndStockGreaterThanAndActivoTrue(Usuario usuario, int stock);
    
    ProductoEnVenta findByUsuarioAndProductoIdAndActivoTrue(Usuario usuario, Long productoId);

    List<ProductoEnVenta> findByActivoTrueOrderByProductoTituloAsc();
}
