package com.pk.mobywatel.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class IdentityCard extends Document {

    @Column(nullable = false)
    private String citizenship;
}
