package benzride_api.dto;

import benzride_api.entity.enums.BookingStatus;
import benzride_api.entity.enums.PaymentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponseDto {

    private String id;
    private Long motorId;
    private String motorName;
    private String customerName;
    private String customerPhone;
    private String deliveryLocation;
    private String notes;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer durationDays;
    private Long totalPrice;
    private BookingStatus status;
    private PaymentStatus paymentStatus;
    private String paymentUrl;
    private LocalDateTime createdAt;
}
