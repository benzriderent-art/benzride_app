package benzride_api.repository;

import benzride_api.entity.Tour;
import benzride_api.entity.enums.TourCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long> {
    List<Tour> findByAvailableTrue();
    List<Tour> findByCategory(TourCategory category);
}
