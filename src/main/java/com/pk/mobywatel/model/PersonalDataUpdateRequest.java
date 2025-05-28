package com.pk.mobywatel.model;

import com.pk.mobywatel.util.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalDataUpdateRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizenID")
    private Citizen citizen;

    @Column(nullable = false)
    private String requestedFirstName;

    @Column(nullable = false)
    private String requestedLastName;

    @Column(nullable = false)
    private LocalDate requestedBirthDate;

    @Enumerated(EnumType.STRING)
    private Gender requestedGender;

    @Column(nullable = false)
    private Boolean approved;

    @Column(nullable = false)
    private Boolean processed;

    @Column(nullable = false)
    private LocalDate requestDate;
}
