package benzride_api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class XenditWebhookDto {

    private String id;

    @JsonProperty("external_id")
    private String externalId;

    private String status;

    @JsonProperty("paid_amount")
    private Long paidAmount;

    @JsonProperty("payment_method")
    private String paymentMethod;
}
