package proyectoapi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "compras_usuario")
public class CompraProducto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private ProductoEnVenta producto;

    @Column(nullable = false)
    private int cantidad;

  
    @Column(nullable = false)
    private LocalDateTime fechaCompra;

    @Column(nullable = false)
    private Double precioUnitario;
}
