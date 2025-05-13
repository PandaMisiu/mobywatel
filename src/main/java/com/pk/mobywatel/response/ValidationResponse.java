package com.pk.mobywatel.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ValidationResponse{
    private boolean valid;
    private String email;
    private Integer userID;
    private String[] roles;
    private String message;
}