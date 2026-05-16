package proyectoapi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import proyectoapi.model.Usuario;
import proyectoapi.model.Venta;

import java.util.List;

@Repository
public interface VentaRepository extends JpaRepository<Venta, Long> {
    List<Venta> findByUsuarioOrderByFechaVentaDesc(Usuario usuario);

    @Query("SELECT DISTINCT v FROM Venta v JOIN v.items i WHERE i.producto.usuario = :vendedor ORDER BY v.fechaVenta DESC")
    List<Venta> findVentasByVendedor(@Param("vendedor") Usuario vendedor);
}
