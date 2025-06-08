package com.pk.mobywatel.model;

import com.pk.mobywatel.util.EncryptionConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Entity
@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer documentID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizenID")
    private Citizen citizen;

    @Column(nullable = true)
    @Convert(converter = EncryptionConverter.class)
    private String photoURL;

    @Column(nullable = false)
    private LocalDate issueDate;

    @Column(nullable = false)
    private LocalDate expirationDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "officialID")
    private Official issueAuthority;

    @Column(nullable = false)
    private Boolean lost;
}
