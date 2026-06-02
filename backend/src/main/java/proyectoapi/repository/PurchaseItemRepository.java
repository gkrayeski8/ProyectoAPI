package proyectoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import proyectoapi.model.PurchaseItem;
import proyectoapi.model.User;
import java.util.List;

public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, Long> {
    
    // Get todas las compras de un user
    List<PurchaseItem> findByUser(User user);
    
    // Get compras de un user ordenadas por fecha (más recientes primero)
    List<PurchaseItem> findByUserOrderByFechaCompraDesc(User user);
}