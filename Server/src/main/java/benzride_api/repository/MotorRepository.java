package benzride_api.repository;

import benzride_api.entity.Motor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MotorRepository extends JpaRepository<Motor, Long> {

    List<Motor> findByAvailableTrue();
}
