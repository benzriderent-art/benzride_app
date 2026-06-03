package benzride_api.controller;

import benzride_api.dto.TourBookingRequestDto;
import benzride_api.entity.TourBooking;
import benzride_api.entity.enums.TourBookingStatus;
import benzride_api.service.TourBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tour-bookings")
@RequiredArgsConstructor
public class TourBookingController {

    private final TourBookingService tourBookingService;

    @GetMapping
    public ResponseEntity<List<TourBooking>> getAll(
            @RequestParam(required = false) TourBookingStatus status) {
        List<TourBooking> bookings = status != null
            ? tourBookingService.findByStatus(status)
            : tourBookingService.findAll();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourBooking> getById(@PathVariable String id) {
        return ResponseEntity.ok(tourBookingService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TourBooking> create(@Valid @RequestBody TourBookingRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tourBookingService.create(dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TourBooking> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        TourBookingStatus newStatus = TourBookingStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(tourBookingService.updateStatus(id, newStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        tourBookingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
