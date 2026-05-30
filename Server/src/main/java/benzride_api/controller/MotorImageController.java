package benzride_api.controller;

import benzride_api.entity.MotorImage;
import benzride_api.service.MotorImageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/motors/{motorId}/images")
public class MotorImageController {

    private final MotorImageService motorImageService;

    public MotorImageController(MotorImageService motorImageService) {
        this.motorImageService = motorImageService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<List<MotorImage>> upload(
            @PathVariable Long motorId,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        return ResponseEntity.ok(motorImageService.uploadImages(motorId, files));
    }

    @GetMapping("/{uuid}/data")
    public ResponseEntity<byte[]> getData(
            @PathVariable Long motorId,
            @PathVariable String uuid) {
        MotorImage image = motorImageService.getImageByUuid(uuid);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=604800")
                .body(image.getData());
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long motorId,
            @PathVariable Long imageId) {
        motorImageService.deleteImage(motorId, imageId);
        return ResponseEntity.noContent().build();
    }
}
