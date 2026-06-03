package benzride_api.dto;

import benzride_api.entity.enums.TourCategory;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class TourListResponseDto {
    private Long id;
    private String name;
    private String nameEn;
    private String description;
    private String descriptionEn;
    private TourCategory category;
    private Integer durationHours;
    private Long pricePerPerson;
    private Integer maxParticipants;
    private String location;
    private Boolean available;
    private Boolean featured;
    private String firstImageUrl;
    private List<String> includes;
    private List<String> includesEn;
}
