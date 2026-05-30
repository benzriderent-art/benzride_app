package benzride_api.repository;

import benzride_api.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    Optional<Payment> findByXenditInvoiceId(String xenditInvoiceId);

    Optional<Payment> findByBookingId(String bookingId);
}
