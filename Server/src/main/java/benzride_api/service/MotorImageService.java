package benzride_api.service;

import benzride_api.entity.Motor;
import benzride_api.entity.MotorImage;
import benzride_api.exception.ResourceNotFoundException;
import benzride_api.repository.MotorImageRepository;
import benzride_api.repository.MotorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class MotorImageService {

    @Value("${app.server-url:http://localhost:8080}")
    private String serverUrl;

    private final MotorRepository motorRepository;
    private final MotorImageRepository motorImageRepository;

    public MotorImageService(MotorRepository motorRepository, MotorImageRepository motorImageRepository) {
        this.motorRepository = motorRepository;
        this.motorImageRepository = motorImageRepository;
    }

    @Transactional
    public List<MotorImage> uploadImages(Long motorId, List<MultipartFile> files) throws IOException {
        Motor motor = motorRepository.findById(motorId)
                .orElseThrow(() -> new ResourceNotFoundException("Motor not found with id: " + motorId));

        int nextOrder = motor.getImages().size();
        List<MotorImage> saved = new ArrayList<>();

        for (MultipartFile file : files) {
            String uuid = UUID.randomUUID().toString();
            MotorImage image = MotorImage.builder()
                    .motor(motor)
                    .uuid(uuid)
                    .data(file.getBytes())
                    .contentType(file.getContentType() != null ? file.getContentType() : "image/jpeg")
                    .imageUrl(serverUrl + "/api/motors/" + motorId + "/images/" + uuid + "/data")
                    .displayOrder(nextOrder++)
                    .build();
            saved.add(motorImageRepository.save(image));
        }
        return saved;
    }

    public MotorImage getImageByUuid(String uuid) {
        return motorImageRepository.findByUuid(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + uuid));
    }

    @Transactional
    public void deleteImage(Long motorId, Long imageId) {
        MotorImage image = motorImageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));
        motorImageRepository.delete(image);
    }
}
