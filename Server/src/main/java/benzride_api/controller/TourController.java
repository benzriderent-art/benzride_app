package benzride_api.controller;

import benzride_api.dto.TourListResponseDto;
import benzride_api.dto.TourRequestDto;
import benzride_api.entity.Tour;
import benzride_api.service.TourService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
@RequiredArgsConstructor
public class TourController {

    private final TourService tourService;

    @GetMapping
    public ResponseEntity<List<TourListResponseDto>> getAll(
            @RequestParam(required = false) Boolean available) {
        List<TourListResponseDto> tours = Boolean.TRUE.equals(available)
            ? tourService.findAvailableListDto()
            : tourService.findAllListDto();
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getById(@PathVariable Long id) {
        return ResponseEntity.ok(tourService.findByIdFull(id));
    }

    @PostMapping
    public ResponseEntity<Tour> create(@Valid @RequestBody TourRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tourService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tour> update(
            @PathVariable Long id,
            @Valid @RequestBody TourRequestDto dto) {
        return ResponseEntity.ok(tourService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tourService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
