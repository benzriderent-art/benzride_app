package benzride_api.controller;

import benzride_api.entity.TourImage;
import benzride_api.service.TourImageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/tours/{tourId}/images")
public class TourImageController {

    private final TourImageService tourImageService;

    public TourImageController(TourImageService tourImageService) {
        this.tourImageService = tourImageService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<List<TourImage>> upload(
            @PathVariable Long tourId,
            @RequestParam("files") List<MultipartFile> files) throws IOException {
        return ResponseEntity.ok(tourImageService.uploadImages(tourId, files));
    }

    @GetMapping("/{uuid}/data")
    public ResponseEntity<byte[]> getData(
            @PathVariable Long tourId,
            @PathVariable String uuid) {
        TourImage image = tourImageService.getImageByUuid(uuid);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=604800")
                .body(image.getData());
    }

    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> delete(
            @PathVariable Long tourId,
            @PathVariable Long imageId) {
        tourImageService.deleteImage(tourId, imageId);
        return ResponseEntity.noContent().build();
    }
}
