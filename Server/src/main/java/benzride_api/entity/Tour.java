package benzride_api.entity;

import benzride_api.entity.enums.TourCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tours")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
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

    // EAGER — lightweight URL strings, needed for list view image
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tour_images", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "image_url")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    // LAZY — only needed for detail page; @BatchSize batches queries across tours
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_includes", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "item")
    @BatchSize(size = 25)
    @Builder.Default
    private List<String> includes = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_highlights", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "highlight")
    @BatchSize(size = 25)
    @Builder.Default
    private List<String> highlights = new ArrayList<>();

    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    @OrderBy("displayOrder ASC")
    @BatchSize(size = 25)
    @Builder.Default
    private List<TourImage> tourImages = new ArrayList<>();

    @Builder.Default
    private Boolean available = true;

    @Builder.Default
    private Boolean featured = false;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_itinerary", joinColumns = @JoinColumn(name = "tour_id"))
    @OrderColumn(name = "step_order")
    @Column(name = "step")
    @BatchSize(size = 25)
    @Builder.Default
    private List<String> itinerary = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_what_to_bring", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "item")
    @BatchSize(size = 25)
    @Builder.Default
    private List<String> whatToBring = new ArrayList<>();

    private String nameEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_includes_en", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "item")
    @BatchSize(size = 25)
    @Builder.Default
    private List<String> includesEn = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_highlights_en", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "highlight")
    @BatchSize(size = 25)
    @Builder.Default
    private List<String> highlightsEn = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_itinerary_en", joinColumns = @JoinColumn(name = "tour_id"))
    @OrderColumn(name = "step_order")
    @Column(name = "step")
    @BatchSize(size = 25)
    @Builder.Default
    private List<String> itineraryEn = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "tour_what_to_bring_en", joinColumns = @JoinColumn(name = "tour_id"))
    @Column(name = "item")
    @BatchSize(size = 25)
    @Builder.Default
    private List<String> whatToBringEn = new ArrayList<>();

    private String guideLanguage;

    private Integer minBookingHours;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
