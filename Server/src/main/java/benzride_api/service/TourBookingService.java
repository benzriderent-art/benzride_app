package benzride_api.service;

import benzride_api.dto.TourBookingRequestDto;
import benzride_api.entity.Tour;
import benzride_api.entity.TourBooking;
import benzride_api.entity.enums.TourBookingStatus;
import benzride_api.exception.ResourceNotFoundException;
import benzride_api.repository.TourBookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TourBookingService {

    private final TourBookingRepository tourBookingRepository;
    private final TourService tourService;

    public List<TourBooking> findAll() {
        return tourBookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<TourBooking> findByStatus(TourBookingStatus status) {
        return tourBookingRepository.findByStatus(status);
    }

    public TourBooking findById(String id) {
        return tourBookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tour booking not found with id: " + id));
    }

    @Transactional
    public TourBooking create(TourBookingRequestDto dto) {
        Tour tour = tourService.findById(dto.getTourId());

        if (!tour.getAvailable()) {
            throw new IllegalStateException("Tour is not available");
        }

        long totalPrice = (long) dto.getParticipants() * tour.getPricePerPerson();

        TourBooking booking = TourBooking.builder()
            .tour(tour)
            .customerName(dto.getCustomerName())
            .customerPhone(dto.getCustomerPhone())
            .tourDate(dto.getTourDate())
            .participants(dto.getParticipants())
            .totalPrice(totalPrice)
            .notes(dto.getNotes())
            .status(TourBookingStatus.PENDING)
            .build();

        return tourBookingRepository.save(booking);
    }

    @Transactional
    public TourBooking updateStatus(String id, TourBookingStatus newStatus) {
        TourBooking booking = findById(id);
        booking.setStatus(newStatus);
        return tourBookingRepository.save(booking);
    }

    @Transactional
    public void delete(String id) {
        TourBooking booking = tourBookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Tour booking not found with id: " + id));
        tourBookingRepository.delete(booking);
    }
}
