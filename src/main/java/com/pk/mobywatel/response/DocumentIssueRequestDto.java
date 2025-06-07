package com.pk.mobywatel.response;

import com.pk.mobywatel.util.RequestedDocument;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
public abstract class DocumentIssueRequestDto {
    private Integer requestID;
    private Integer citizenID;
    private String photoURL;
    private RequestedDocument type;
}
