package benzride_api.dto;

import benzride_api.entity.enums.TransmissionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MotorDto {

    @NotBlank
    private String name;

    @NotNull
    @Min(50)
    private Integer cc;

    @NotNull
    private TransmissionType transmission;

    @NotNull
    private Integer year;

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

}
