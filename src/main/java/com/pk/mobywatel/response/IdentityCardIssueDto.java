package com.pk.mobywatel.response;

import lombok.Data;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
public class IdentityCardIssueDto extends DocumentIssueRequestDto {
    private String citizenship;
}
