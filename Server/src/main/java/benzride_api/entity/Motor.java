package benzride_api.entity;

import benzride_api.entity.enums.TransmissionType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "motors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(exclude = {"bookings", "images"})
public class Motor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    @Min(50)
    private Integer cc;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TransmissionType transmission;

    @NotNull
    private Integer year;

    @Builder.Default
    private Boolean available = true;

    @NotNull
    @Min(0)
    private Long priceDay;

    @NotNull
    @Min(0)
    private Long priceWeek;

    @NotNull
    @Min(0)
    private Long priceMonth;

    @OneToMany(mappedBy = "motor", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @Builder.Default
    private List<MotorImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "motor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @Builder.Default
    private List<Booking> bookings = new ArrayList<>();
}
