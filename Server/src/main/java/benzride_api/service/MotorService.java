package benzride_api.service;

import benzride_api.dto.MotorDto;
import benzride_api.entity.Motor;
import benzride_api.exception.ResourceNotFoundException;
import benzride_api.repository.MotorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MotorService {

    private final MotorRepository motorRepository;

    public List<Motor> findAll() {
        return motorRepository.findAll();
    }

    public List<Motor> findAvailable() {
        return motorRepository.findByAvailableTrue();
    }

    public Motor findById(Long id) {
        return motorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Motor not found with id: " + id));
    }

    public Motor create(MotorDto dto) {
        Motor motor = Motor.builder()
            .name(dto.getName())
            .cc(dto.getCc())
            .transmission(dto.getTransmission())
            .year(dto.getYear())
            .available(dto.getAvailable() != null ? dto.getAvailable() : true)
            .priceDay(dto.getPriceDay())
            .priceWeek(dto.getPriceWeek())
            .priceMonth(dto.getPriceMonth())
            .build();
        return motorRepository.save(motor);
    }

    public Motor update(Long id, MotorDto dto) {
        Motor motor = findById(id);
        motor.setName(dto.getName());
        motor.setCc(dto.getCc());
        motor.setTransmission(dto.getTransmission());
        motor.setYear(dto.getYear());
        motor.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : motor.getAvailable());
        motor.setPriceDay(dto.getPriceDay());
        motor.setPriceWeek(dto.getPriceWeek());
        motor.setPriceMonth(dto.getPriceMonth());
        return motorRepository.save(motor);
    }

    public void delete(Long id) {
        Motor motor = findById(id);
        motorRepository.delete(motor);
    }
}
