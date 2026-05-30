package benzride_api.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequestDto {

    @NotNull
    private Long motorId;

    @NotBlank
    private String customerName;

    @NotBlank
    private String customerPhone;

    @NotBlank
    private String deliveryLocation;

    private String notes;

    @NotNull
    private LocalDate startDate;

    @NotNull
    @Future
    private LocalDate endDate;
}
