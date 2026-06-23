package proyectoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import proyectoapi.model.SaleProduct;
import proyectoapi.model.User;
import java.util.List;

public interface SaleProductRepository extends JpaRepository<SaleProduct, Long> {
    
    List<SaleProduct> findByUserAndActivoTrue(User user);
    
    List<SaleProduct> findByUserAndStockGreaterThanAndActivoTrue(User user, int stock);
    
    SaleProduct findByUserAndProductIdAndActivoTrue(User user, Long productId);

    List<SaleProduct> findByActivoTrueOrderByProductTituloAsc();

    List<SaleProduct> findByProductCategoryAndActivoTrueOrderByProductTituloAsc(String category);

    List<SaleProduct> findByProductTituloContainingIgnoreCaseAndActivoTrueOrderByProductTituloAsc(String query);

    List<SaleProduct> findByProductCategoryAndProductTituloContainingIgnoreCaseAndActivoTrueOrderByProductTituloAsc(String category, String query);
}
