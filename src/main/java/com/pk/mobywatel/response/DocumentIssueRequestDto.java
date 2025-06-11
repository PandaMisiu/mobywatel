package com.pk.mobywatel.response;

import com.pk.mobywatel.util.RequestedDocument;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import org.springframework.core.io.Resource;

@SuperBuilder
@Data
public abstract class DocumentIssueRequestDto {
    private Integer requestID;
    private Integer citizenID;
//    private Resource photo;
    private RequestedDocument type;
}
