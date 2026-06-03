package benzride_api.repository;

import benzride_api.entity.TourImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TourImageRepository extends JpaRepository<TourImage, Long> {
    Optional<TourImage> findByUuid(String uuid);
}
