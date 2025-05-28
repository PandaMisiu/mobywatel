package com.pk.mobywatel.model;

import jakarta.persistence.Column;
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
    private String citizenship;
}
