package proyectoapi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.OneToMany;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@Entity
@Table(name = "usuarios")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellido;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private boolean bloqueado = false;

    @JsonIgnoreProperties({"usuario"})
    @OneToMany(mappedBy = "usuario")
    private List<ProductoEnVenta> productosEnVenta;

    @OneToMany(mappedBy = "usuario")
    private List<CompraProducto> productosComprados;
}