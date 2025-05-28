package com.pk.mobywatel.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public abstract class DocumentDto {
    private Integer documentID;
    private String photoURL;
    private LocalDate issueDate;
    private LocalDate expirationDate;
    private String type;
    private Boolean lost;
}
