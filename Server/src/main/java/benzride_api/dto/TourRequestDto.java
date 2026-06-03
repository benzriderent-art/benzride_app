package benzride_api.dto;

import benzride_api.entity.enums.TourCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class TourRequestDto {
    @NotBlank
    private String name;

    @NotBlank
    private String description;

    @NotNull
    private TourCategory category;

    @NotNull
    private Integer durationHours;

    @NotNull
    @Min(0)
    private Long pricePerPerson;

    @NotNull
    private Integer maxParticipants;

    @NotBlank
    private String location;

    private List<String> images;
    private List<String> includes;
    private List<String> highlights;
    private List<String> itinerary;
    private List<String> whatToBring;

    // English content
    private String nameEn;
    private String descriptionEn;
    private List<String> includesEn;
    private List<String> highlightsEn;
    private List<String> itineraryEn;
    private List<String> whatToBringEn;

    private Boolean available;
    private Boolean featured;
    private String guideLanguage;
    private Integer minBookingHours;
}
