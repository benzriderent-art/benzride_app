package benzride_api.service;

import benzride_api.dto.TourRequestDto;
import benzride_api.entity.Tour;
import benzride_api.exception.ResourceNotFoundException;
import benzride_api.repository.TourRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TourService {

    private final TourRepository tourRepository;

    public List<Tour> findAll() {
        return tourRepository.findAll();
    }

    public List<Tour> findAvailable() {
        return tourRepository.findByAvailableTrue();
    }

    public Tour findById(Long id) {
        return tourRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + id));
    }

    @Transactional
    public Tour create(TourRequestDto dto) {
        Tour tour = Tour.builder()
            .name(dto.getName())
            .description(dto.getDescription())
            .category(dto.getCategory())
            .durationHours(dto.getDurationHours())
            .pricePerPerson(dto.getPricePerPerson())
            .maxParticipants(dto.getMaxParticipants())
            .location(dto.getLocation())
            .images(dto.getImages() != null ? dto.getImages() : new ArrayList<>())
            .includes(dto.getIncludes() != null ? dto.getIncludes() : new ArrayList<>())
            .highlights(dto.getHighlights() != null ? dto.getHighlights() : new ArrayList<>())
            .itinerary(dto.getItinerary() != null ? dto.getItinerary() : new ArrayList<>())
            .whatToBring(dto.getWhatToBring() != null ? dto.getWhatToBring() : new ArrayList<>())
            .nameEn(dto.getNameEn())
            .descriptionEn(dto.getDescriptionEn())
            .includesEn(dto.getIncludesEn() != null ? dto.getIncludesEn() : new ArrayList<>())
            .highlightsEn(dto.getHighlightsEn() != null ? dto.getHighlightsEn() : new ArrayList<>())
            .itineraryEn(dto.getItineraryEn() != null ? dto.getItineraryEn() : new ArrayList<>())
            .whatToBringEn(dto.getWhatToBringEn() != null ? dto.getWhatToBringEn() : new ArrayList<>())
            .available(!Boolean.FALSE.equals(dto.getAvailable()))
            .featured(Boolean.TRUE.equals(dto.getFeatured()))
            .guideLanguage(dto.getGuideLanguage())
            .minBookingHours(dto.getMinBookingHours())
            .build();
        return tourRepository.save(tour);
    }

    @Transactional
    public Tour update(Long id, TourRequestDto dto) {
        Tour tour = findById(id);
        tour.setName(dto.getName());
        tour.setDescription(dto.getDescription());
        tour.setCategory(dto.getCategory());
        tour.setDurationHours(dto.getDurationHours());
        tour.setPricePerPerson(dto.getPricePerPerson());
        tour.setMaxParticipants(dto.getMaxParticipants());
        tour.setLocation(dto.getLocation());
        if (dto.getImages() != null) tour.setImages(dto.getImages());
        if (dto.getIncludes() != null) tour.setIncludes(dto.getIncludes());
        if (dto.getHighlights() != null) tour.setHighlights(dto.getHighlights());
        if (dto.getItinerary() != null) tour.setItinerary(dto.getItinerary());
        if (dto.getWhatToBring() != null) tour.setWhatToBring(dto.getWhatToBring());
        tour.setNameEn(dto.getNameEn());
        tour.setDescriptionEn(dto.getDescriptionEn());
        if (dto.getIncludesEn() != null) tour.setIncludesEn(dto.getIncludesEn());
        if (dto.getHighlightsEn() != null) tour.setHighlightsEn(dto.getHighlightsEn());
        if (dto.getItineraryEn() != null) tour.setItineraryEn(dto.getItineraryEn());
        if (dto.getWhatToBringEn() != null) tour.setWhatToBringEn(dto.getWhatToBringEn());
        if (dto.getAvailable() != null) tour.setAvailable(Boolean.TRUE.equals(dto.getAvailable()));
        if (dto.getFeatured() != null) tour.setFeatured(Boolean.TRUE.equals(dto.getFeatured()));
        if (dto.getGuideLanguage() != null) tour.setGuideLanguage(dto.getGuideLanguage());
        if (dto.getMinBookingHours() != null) tour.setMinBookingHours(dto.getMinBookingHours());
        return tourRepository.save(tour);
    }

    @Transactional
    public void delete(Long id) {
        Tour tour = findById(id);
        tourRepository.delete(tour);
    }
}
