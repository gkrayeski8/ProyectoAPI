package proyectoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import proyectoapi.model.Favorite;
import proyectoapi.model.Product;
import proyectoapi.model.User;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct_Id(User user, Long productId);
    void deleteByUser(User user);
}
