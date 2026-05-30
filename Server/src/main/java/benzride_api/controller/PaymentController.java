package benzride_api.controller;

import benzride_api.dto.XenditWebhookDto;
import benzride_api.service.XenditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final XenditService xenditService;

    @PostMapping("/xendit-callback")
    public ResponseEntity<Void> xenditCallback(
            @RequestBody XenditWebhookDto dto,
            @RequestHeader("x-callback-token") String callbackToken) {
        xenditService.handleWebhook(dto, callbackToken);
        return ResponseEntity.ok().build();
    }
}
