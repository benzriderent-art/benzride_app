package benzride_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "motor_images")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"motor", "data"})
public class MotorImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motor_id", nullable = false)
    @JsonIgnore
    private Motor motor;

    @Column(name = "uuid", unique = true, nullable = false)
    private String uuid;

    @Column(name = "data")
    @JsonIgnore
    private byte[] data;

    private String contentType;

    private String imageUrl;

    private Integer displayOrder;
}
