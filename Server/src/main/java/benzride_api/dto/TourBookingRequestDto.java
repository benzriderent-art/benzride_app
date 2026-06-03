package benzride_api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TourBookingRequestDto {
    @NotNull
    private Long tourId;

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerPhone;

    @NotNull
    private LocalDate tourDate;

    @NotNull
    @Min(1)
    private Integer participants;

    private String notes;
}
