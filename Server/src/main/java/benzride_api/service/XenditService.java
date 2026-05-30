package benzride_api.service;

import benzride_api.dto.XenditWebhookDto;
import benzride_api.entity.Booking;
import benzride_api.entity.Payment;
import benzride_api.entity.enums.BookingStatus;
import benzride_api.entity.enums.PaymentStatus;
import benzride_api.exception.ResourceNotFoundException;
import benzride_api.repository.BookingRepository;
import benzride_api.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class XenditService {

    private final RestTemplate restTemplate;
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Value("${xendit.api-key}")
    private String apiKey;

    @Value("${xendit.base-url}")
    private String baseUrl;

    @Value("${xendit.success-redirect-url}")
    private String successRedirectUrl;

    @Value("${xendit.failure-redirect-url}")
    private String failureRedirectUrl;

    @Value("${xendit.callback-token}")
    private String callbackToken;

    @Transactional
    public Payment createInvoice(Booking booking) {
        String externalId = "BK-" + booking.getId();
        String description = String.format("Sewa %s - %d hari (%s s/d %s)",
            booking.getMotor().getName(),
            booking.getDurationDays(),
            booking.getStartDate(),
            booking.getEndDate()
        );

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("external_id", externalId);
        requestBody.put("amount", booking.getTotalPrice());
        requestBody.put("description", description);
        requestBody.put("success_redirect_url", successRedirectUrl);
        requestBody.put("failure_redirect_url", failureRedirectUrl);
        requestBody.put("customer", Map.of(
            "given_names", booking.getCustomerName(),
            "mobile_number", booking.getCustomerPhone()
        ));
        requestBody.put("items", List.of(Map.of(
            "name", booking.getMotor().getName(),
            "quantity", booking.getDurationDays(),
            "price", booking.getMotor().getPriceDay(),
            "category", "Motor Rental"
        )));

        HttpHeaders headers = buildHeaders();
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                baseUrl + "/v2/invoices",
                HttpMethod.POST,
                request,
                new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> body = response.getBody();
            String xenditInvoiceId = (String) body.get("id");
            String paymentUrl = (String) body.get("invoice_url");

            Payment payment = Payment.builder()
                .booking(booking)
                .xenditInvoiceId(xenditInvoiceId)
                .xenditPaymentUrl(paymentUrl)
                .amount(booking.getTotalPrice())
                .status(PaymentStatus.PENDING)
                .build();

            return paymentRepository.save(payment);

        } catch (Exception e) {
            log.error("Failed to create Xendit invoice for booking {}: {}", booking.getId(), e.getMessage());
            Payment payment = Payment.builder()
                .booking(booking)
                .amount(booking.getTotalPrice())
                .status(PaymentStatus.PENDING)
                .build();
            return paymentRepository.save(payment);
        }
    }

    @Transactional
    public void handleWebhook(XenditWebhookDto dto, String callbackTokenHeader) {
        if (!this.callbackToken.equals(callbackTokenHeader)) {
            throw new SecurityException("Invalid Xendit callback token");
        }

        Payment payment = paymentRepository.findByXenditInvoiceId(dto.getId())
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found for invoice: " + dto.getId()));

        switch (dto.getStatus()) {
            case "PAID" -> {
                payment.setStatus(PaymentStatus.PAID);
                payment.setPaidAt(LocalDateTime.now());
                payment.getBooking().setStatus(BookingStatus.ACTIVE);
                bookingRepository.save(payment.getBooking());
            }
            case "EXPIRED" -> payment.setStatus(PaymentStatus.EXPIRED);
            default -> log.warn("Unhandled Xendit payment status: {}", dto.getStatus());
        }

        paymentRepository.save(payment);
    }

    private HttpHeaders buildHeaders() {
        String credentials = apiKey + ":";
        String encoded = Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set(HttpHeaders.AUTHORIZATION, "Basic " + encoded);
        return headers;
    }
}
