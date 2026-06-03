package benzride_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tour_images_upload")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"tour", "data"})
public class TourImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tour_id", nullable = false)
    @JsonIgnore
    private Tour tour;

    @Column(name = "uuid", unique = true, nullable = false)
    private String uuid;

    @Column(name = "data")
    @JsonIgnore
    private byte[] data;

    private String contentType;

    private String imageUrl;

    private Integer displayOrder;
}
