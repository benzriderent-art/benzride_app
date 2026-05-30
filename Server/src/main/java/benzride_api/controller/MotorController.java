package benzride_api.controller;

import benzride_api.dto.MotorDto;
import benzride_api.entity.Motor;
import benzride_api.service.MotorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/motors")
@RequiredArgsConstructor
public class MotorController {

    private final MotorService motorService;

    @GetMapping
    public ResponseEntity<List<Motor>> getAll(
            @RequestParam(required = false) Boolean available) {
        List<Motor> motors = Boolean.TRUE.equals(available)
            ? motorService.findAvailable()
            : motorService.findAll();
        return ResponseEntity.ok(motors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Motor> getById(@PathVariable Long id) {
        return ResponseEntity.ok(motorService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Motor> create(@Valid @RequestBody MotorDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(motorService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Motor> update(@PathVariable Long id, @Valid @RequestBody MotorDto dto) {
        return ResponseEntity.ok(motorService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        motorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
