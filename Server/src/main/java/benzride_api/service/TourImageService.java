package benzride_api.service;

import benzride_api.entity.Tour;
import benzride_api.entity.TourImage;
import benzride_api.exception.ResourceNotFoundException;
import benzride_api.repository.TourImageRepository;
import benzride_api.repository.TourRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TourImageService {

    @Value("${app.server-url:http://localhost:8080}")
    private String serverUrl;

    private final TourRepository tourRepository;
    private final TourImageRepository tourImageRepository;

    public TourImageService(TourRepository tourRepository, TourImageRepository tourImageRepository) {
        this.tourRepository = tourRepository;
        this.tourImageRepository = tourImageRepository;
    }

    @Transactional
    public List<TourImage> uploadImages(Long tourId, List<MultipartFile> files) throws IOException {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new ResourceNotFoundException("Tour not found with id: " + tourId));

        int nextOrder = tour.getTourImages().size();
        List<TourImage> saved = new ArrayList<>();

        for (MultipartFile file : files) {
            String uuid = UUID.randomUUID().toString();
            TourImage image = TourImage.builder()
                    .tour(tour)
                    .uuid(uuid)
                    .data(file.getBytes())
                    .contentType(file.getContentType() != null ? file.getContentType() : "image/jpeg")
                    .imageUrl(serverUrl + "/api/tours/" + tourId + "/images/" + uuid + "/data")
                    .displayOrder(nextOrder++)
                    .build();
            saved.add(tourImageRepository.save(image));
        }
        return saved;
    }

    public TourImage getImageByUuid(String uuid) {
        return tourImageRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + uuid));
    }

    @Transactional
    public void deleteImage(Long tourId, Long imageId) {
        TourImage image = tourImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));
        tourImageRepository.delete(image);
    }
}
