package proyectoapi.repository;

import proyectoapi.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.role = proyectoapi.model.Role.VENDEDOR AND EXISTS (SELECT 1 FROM SaleProduct p WHERE p.user = u)")
    public List<User> findVendedores();
}
