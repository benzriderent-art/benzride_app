package benzride_api.repository;

import benzride_api.entity.TourBooking;
import benzride_api.entity.enums.TourBookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourBookingRepository extends JpaRepository<TourBooking, String> {
    List<TourBooking> findByStatus(TourBookingStatus status);
    List<TourBooking> findAllByOrderByCreatedAtDesc();
}
