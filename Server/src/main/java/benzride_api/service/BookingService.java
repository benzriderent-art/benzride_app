package benzride_api.service;

import benzride_api.dto.BookingRequestDto;
import benzride_api.dto.BookingResponseDto;
import benzride_api.entity.Booking;
import benzride_api.entity.Motor;
import benzride_api.entity.Payment;
import benzride_api.entity.enums.BookingStatus;
import benzride_api.entity.enums.PaymentStatus;
import benzride_api.exception.ResourceNotFoundException;
import benzride_api.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final MotorService motorService;
    private final XenditService xenditService;

    public List<Booking> findAll() {
        return bookingRepository.findAll();
    }

    public List<Booking> findByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }

    public Booking findById(String id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
    }

    private static final List<BookingStatus> ACTIVE_STATUSES =
        List.of(BookingStatus.CANCELLED, BookingStatus.COMPLETED);

    private long calculateTotalPrice(Motor motor, int days) {
        long pDay = motor.getPriceDay();
        long pWeek = motor.getPriceWeek();
        long pMonth = motor.getPriceMonth();

        if (pMonth > 0 && days >= 30) {
            int months = days / 30;
            int remaining = days % 30;
            long remPrice = (pWeek > 0 && remaining >= 7)
                ? (long)(remaining / 7) * pWeek + (long)(remaining % 7) * pDay
                : (long) remaining * pDay;
            return (long) months * pMonth + remPrice;
        }

        if (pWeek > 0 && days >= 7) {
            int weeks = days / 7;
            int remaining = days % 7;
            return (long) weeks * pWeek + (long) remaining * pDay;
        }

        return (long) days * pDay;
    }

    @Transactional
    public BookingResponseDto create(BookingRequestDto dto) {
        Motor motor = motorService.findById(dto.getMotorId());

        if (!motor.getAvailable()) {
            throw new IllegalStateException("Motor is not available for rent");
        }

        if (!bookingRepository.findOverlapping(dto.getMotorId(), dto.getStartDate(), dto.getEndDate(), ACTIVE_STATUSES).isEmpty()) {
            throw new IllegalStateException("Motor sudah dipesan pada tanggal tersebut. Pilih tanggal lain.");
        }

        int durationDays = (int) ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate());
        if (durationDays < 1) {
            throw new IllegalArgumentException("End date must be at least 1 day after start date");
        }

        long totalPrice = calculateTotalPrice(motor, durationDays);

        Booking booking = Booking.builder()
            .motor(motor)
            .customerName(dto.getCustomerName())
            .customerPhone(dto.getCustomerPhone())
            .deliveryLocation(dto.getDeliveryLocation())
            .notes(dto.getNotes())
            .startDate(dto.getStartDate())
            .endDate(dto.getEndDate())
            .durationDays(durationDays)
            .totalPrice(totalPrice)
            .status(BookingStatus.PENDING)
            .build();

        booking = bookingRepository.save(booking);

        Payment payment = xenditService.createInvoice(booking);

        return toResponseDto(booking, payment);
    }

    public List<Map<String, String>> getBookedDates(Long motorId) {
        return bookingRepository.findUpcomingByMotorId(motorId, ACTIVE_STATUSES).stream()
            .map(b -> Map.of(
                "startDate", b.getStartDate().toString(),
                "endDate", b.getEndDate().toString()
            ))
            .collect(Collectors.toList());
    }

    @Transactional
    public BookingResponseDto createManual(BookingRequestDto dto) {
        Motor motor = motorService.findById(dto.getMotorId());

        if (!bookingRepository.findOverlapping(dto.getMotorId(), dto.getStartDate(), dto.getEndDate(), ACTIVE_STATUSES).isEmpty()) {
            throw new IllegalStateException("Motor sudah dipesan pada tanggal tersebut. Pilih tanggal lain.");
        }

        int durationDays = (int) ChronoUnit.DAYS.between(dto.getStartDate(), dto.getEndDate());
        if (durationDays < 1) {
            throw new IllegalArgumentException("End date must be at least 1 day after start date");
        }

        long totalPrice = calculateTotalPrice(motor, durationDays);

        Booking booking = Booking.builder()
            .motor(motor)
            .customerName(dto.getCustomerName())
            .customerPhone(dto.getCustomerPhone())
            .deliveryLocation(dto.getDeliveryLocation())
            .notes(dto.getNotes())
            .startDate(dto.getStartDate())
            .endDate(dto.getEndDate())
            .durationDays(durationDays)
            .totalPrice(totalPrice)
            .status(BookingStatus.ACTIVE)
            .build();

        booking = bookingRepository.save(booking);
        return toResponseDto(booking, null);
    }

    public BookingResponseDto track(String id, String phone) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking tidak ditemukan."));
        if (!booking.getCustomerPhone().trim().equals(phone.trim())) {
            throw new ResourceNotFoundException("Data tidak ditemukan.");
        }
        return toResponseDto(booking, booking.getPayment());
    }

    public BookingResponseDto updateStatus(String id, BookingStatus newStatus) {
        Booking booking = findById(id);
        booking.setStatus(newStatus);
        booking = bookingRepository.save(booking);
        return toResponseDto(booking, booking.getPayment());
    }

    private BookingResponseDto toResponseDto(Booking booking, Payment payment) {
        return BookingResponseDto.builder()
            .id(booking.getId())
            .motorId(booking.getMotor().getId())
            .motorName(booking.getMotor().getName())
            .customerName(booking.getCustomerName())
            .customerPhone(booking.getCustomerPhone())
            .deliveryLocation(booking.getDeliveryLocation())
            .notes(booking.getNotes())
            .startDate(booking.getStartDate())
            .endDate(booking.getEndDate())
            .durationDays(booking.getDurationDays())
            .totalPrice(booking.getTotalPrice())
            .status(booking.getStatus())
            .paymentStatus(payment != null ? payment.getStatus() : PaymentStatus.PENDING)
            .paymentUrl(payment != null ? payment.getXenditPaymentUrl() : null)
            .createdAt(booking.getCreatedAt())
            .build();
    }
}
