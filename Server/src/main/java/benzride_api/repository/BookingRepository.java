package benzride_api.repository;

import benzride_api.entity.Booking;
import benzride_api.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByMotorId(Long motorId);

    List<Booking> findByStartDateBetween(LocalDate from, LocalDate to);

    @Query("SELECT b FROM Booking b WHERE b.motor.id = :motorId " +
           "AND b.status NOT IN :excluded " +
           "AND b.startDate < :endDate AND b.endDate > :startDate")
    List<Booking> findOverlapping(
        @Param("motorId") Long motorId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("excluded") List<BookingStatus> excluded
    );

    @Query("SELECT b FROM Booking b WHERE b.motor.id = :motorId " +
           "AND b.status NOT IN :excluded " +
           "ORDER BY b.startDate ASC")
    List<Booking> findUpcomingByMotorId(
        @Param("motorId") Long motorId,
        @Param("excluded") List<BookingStatus> excluded
    );
}
