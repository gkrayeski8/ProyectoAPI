package proyectoapi.dto;
import lombok.Data;

@Data
public class PublicationDTO {
    private String titulo;
    private String description;
    private String category;
    private String urlImage;
    private Integer stock;
    private Double price;
}
