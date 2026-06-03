package benzride_api.controller;

import benzride_api.dto.BookingEditRequestDto;
import benzride_api.dto.BookingRequestDto;
import benzride_api.dto.BookingResponseDto;
import benzride_api.entity.Booking;
import benzride_api.entity.enums.BookingStatus;
import benzride_api.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingResponseDto>> getAll(
            @RequestParam(required = false) BookingStatus status) {
        List<BookingResponseDto> bookings = status != null
            ? bookingService.findByStatusDto(status)
            : bookingService.findAllDto();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.findById(id));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDto> create(@Valid @RequestBody BookingRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.create(dto));
    }

    @GetMapping("/track")
    public ResponseEntity<BookingResponseDto> track(
            @RequestParam String id,
            @RequestParam String phone) {
        return ResponseEntity.ok(bookingService.track(id, phone));
    }

    @GetMapping("/motor/{motorId}/booked-dates")
    public ResponseEntity<List<Map<String, String>>> getBookedDates(@PathVariable Long motorId) {
        return ResponseEntity.ok(bookingService.getBookedDates(motorId));
    }

    @PostMapping("/whatsapp")
    public ResponseEntity<BookingResponseDto> createWhatsApp(@Valid @RequestBody BookingRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createWhatsApp(dto));
    }

    @PostMapping("/admin")
    public ResponseEntity<BookingResponseDto> createManual(@Valid @RequestBody BookingRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createManual(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingResponseDto> editBooking(
            @PathVariable String id,
            @Valid @RequestBody BookingEditRequestDto dto) {
        return ResponseEntity.ok(bookingService.editBooking(id, dto));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BookingResponseDto> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        BookingStatus newStatus = BookingStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(bookingService.updateStatus(id, newStatus));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        bookingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
