package com.pk.mobywatel.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Getter
@Setter
public class IdentityCardIssueDto extends DocumentIssueRequestDto {
    private String citizenship;
}
