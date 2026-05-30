package benzride_api.config;

import benzride_api.entity.Admin;
import benzride_api.entity.Motor;
import benzride_api.entity.enums.TransmissionType;
import benzride_api.repository.AdminRepository;
import benzride_api.repository.MotorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner seedData(AdminRepository adminRepository, MotorRepository motorRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.findByUsername("admin").isEmpty()) {
                adminRepository.save(Admin.builder()
                        .username("admin")
                        .passwordHash(passwordEncoder.encode("benzrental2024"))
                        .build());
            }

            if (motorRepository.count() == 0) {
                motorRepository.saveAll(List.of(
                        Motor.builder().name("Honda Beat").cc(110).transmission(TransmissionType.AUTOMATIC).year(2023).available(true).priceDay(80000L).priceWeek(500000L).priceMonth(1500000L).build(),
                        Motor.builder().name("Honda Vario 125").cc(125).transmission(TransmissionType.AUTOMATIC).year(2023).available(true).priceDay(90000L).priceWeek(560000L).priceMonth(1700000L).build(),
                        Motor.builder().name("Honda Scoopy").cc(110).transmission(TransmissionType.AUTOMATIC).year(2022).available(true).priceDay(85000L).priceWeek(530000L).priceMonth(1600000L).build(),
                        Motor.builder().name("Honda PCX 160").cc(160).transmission(TransmissionType.AUTOMATIC).year(2023).available(true).priceDay(125000L).priceWeek(780000L).priceMonth(2300000L).build(),
                        Motor.builder().name("Yamaha NMAX 155").cc(155).transmission(TransmissionType.AUTOMATIC).year(2022).available(true).priceDay(135000L).priceWeek(840000L).priceMonth(2500000L).build(),
                        Motor.builder().name("Honda ADV 160").cc(160).transmission(TransmissionType.AUTOMATIC).year(2023).available(false).priceDay(155000L).priceWeek(965000L).priceMonth(2800000L).build()
                ));
            }
        };
    }
}
