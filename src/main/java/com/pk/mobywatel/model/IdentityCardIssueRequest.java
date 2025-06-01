package com.pk.mobywatel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class IdentityCardIssueRequest extends DocumentIssueRequest {
    @Column(nullable = false)
    private String citizenship;
}
