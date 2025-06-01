package com.pk.mobywatel.request;

import java.time.LocalDate;

public record ProcessDocumentIssueBody(Integer requestID,
                                       Boolean approval,
                                       LocalDate expirationDate) {
}
