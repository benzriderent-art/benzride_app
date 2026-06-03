package benzride_api.entity;

import benzride_api.entity.enums.TourBookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tour_bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TourBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerPhone;

    @NotNull
    private LocalDate tourDate;

    @NotNull
    @Min(1)
    private Integer participants;

    @NotNull
    private Long totalPrice;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TourBookingStatus status = TourBookingStatus.PENDING;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
