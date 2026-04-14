package proyectoapi.repository;
import proyectoapi.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    @Query("SELECT DISTINCT p.categoria FROM Producto p WHERE p.categoria IS NOT NULL")
    List<String> findDistinctCategorias();
}
