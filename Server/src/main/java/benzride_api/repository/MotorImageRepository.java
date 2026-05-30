package benzride_api.repository;

import benzride_api.entity.MotorImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MotorImageRepository extends JpaRepository<MotorImage, Long> {
    Optional<MotorImage> findByUuid(String uuid);
}
