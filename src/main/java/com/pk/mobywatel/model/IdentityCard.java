package com.pk.mobywatel.model;

import com.pk.mobywatel.util.EncryptionConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
public class IdentityCard extends Document {
    @Column(nullable = false)
    @Convert(converter = EncryptionConverter.class)
    private String citizenship;
}
