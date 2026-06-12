package proyectoapi;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;
import proyectoapi.model.User;
import proyectoapi.model.Role;
import proyectoapi.model.Product;
import proyectoapi.model.SaleProduct;
import proyectoapi.repository.UserRepository;
import proyectoapi.repository.ProductRepository;
import proyectoapi.repository.SaleProductRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SaleProductRepository saleProductRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, ProductRepository productRepository, SaleProductRepository saleProductRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.saleProductRepository = saleProductRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User user = new User();
            user.setName("Usuario");
            user.setApellido("Prueba");
            user.setEmail("test@test.com");
            user.setPassword(passwordEncoder.encode("123456"));
            user.setRole(Role.VENDEDOR);
            userRepository.save(user);

            Product p1 = new Product();
            p1.setTitulo("Laptop Gamer");
            p1.setDescription("Laptop muy potente con 16GB de RAM y RTX 3060");
            p1.setCategory("Electrónica");
            p1.setUrlImage("https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&q=80");
            productRepository.save(p1);

            SaleProduct sp1 = new SaleProduct();
            sp1.setProduct(p1);
            sp1.setUser(user);
            sp1.setPrice(1500.0);
            sp1.setStock(10);
            saleProductRepository.save(sp1);
            
            Product p2 = new Product();
            p2.setTitulo("Auriculares Inalámbricos");
            p2.setDescription("Con cancelación de ruido activa");
            p2.setCategory("Accesorios");
            p2.setUrlImage("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80");
            productRepository.save(p2);

            SaleProduct sp2 = new SaleProduct();
            sp2.setProduct(p2);
            sp2.setUser(user);
            sp2.setPrice(100.0);
            sp2.setStock(50);
            saleProductRepository.save(sp2);
            
            Product p3 = new Product();
            p3.setTitulo("Silla Ergonómica");
            p3.setDescription("Ideal para largas horas de trabajo o juego");
            p3.setCategory("Muebles");
            p3.setUrlImage("https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80");
            productRepository.save(p3);

            SaleProduct sp3 = new SaleProduct();
            sp3.setProduct(p3);
            sp3.setUser(user);
            sp3.setPrice(250.0);
            sp3.setStock(20);
            saleProductRepository.save(sp3);
            
            System.out.println("=================================================");
            System.out.println("DATOS DE PRUEBA CREADOS CORRECTAMENTE");
            System.out.println("Usuario: test@test.com");
            System.out.println("Password: 123456");
            System.out.println("=================================================");
        }
    }
}
