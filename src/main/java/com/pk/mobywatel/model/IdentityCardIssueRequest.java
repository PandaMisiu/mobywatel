package com.pk.mobywatel.model;

import com.pk.mobywatel.util.EncryptionConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
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
    @Convert(converter = EncryptionConverter.class)
    private String citizenship;
}
