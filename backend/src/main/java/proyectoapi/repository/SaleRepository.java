package proyectoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import proyectoapi.model.User;
import proyectoapi.model.Sale;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByUserOrderByFechaSaleDesc(User user);

    @Query("SELECT DISTINCT v FROM Sale v JOIN v.items i WHERE i.product.user = :vendedor ORDER BY v.fechaSale DESC")
    List<Sale> findSalesByVendedor(@Param("vendedor") User vendedor);
}
