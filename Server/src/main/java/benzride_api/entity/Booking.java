package benzride_api.entity;

import benzride_api.entity.enums.BookingStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    private String id;

    private static final String CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RNG = new SecureRandom();

    private static String generateId() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        StringBuilder suffix = new StringBuilder(4);
        for (int i = 0; i < 4; i++) suffix.append(CHARS.charAt(RNG.nextInt(CHARS.length())));
        return "BENZ-" + date + "-" + suffix;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "motor_id", nullable = false)
    @JsonIgnore
    private Motor motor;

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerPhone;

    @NotBlank
    private String deliveryLocation;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    @NotNull
    private Integer durationDays;

    @NotNull
    private Long totalPrice;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private Payment payment;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (id == null || id.isBlank()) id = generateId();
        createdAt = LocalDateTime.now();
    }
}
