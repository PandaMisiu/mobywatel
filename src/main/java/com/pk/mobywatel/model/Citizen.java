package com.pk.mobywatel.model;

import com.pk.mobywatel.util.EncryptionConverter;
import com.pk.mobywatel.util.Gender;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Citizen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer citizenID;

    @OneToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "userID")
    private UserModel user;

    @Column(nullable = false)
    @Convert(converter = EncryptionConverter.class)
    private String firstName;

    @Column(nullable = false)
    @Convert(converter = EncryptionConverter.class)
    private String lastName;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Column(unique = true,nullable = false)
    @Convert(converter = EncryptionConverter.class)
    private String PESEL;

    @Column(nullable = false)
    private Gender gender;

    @OneToMany(mappedBy = "citizen", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Document> documents = new ArrayList<>();

    @OneToMany(mappedBy = "citizen", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<PersonalDataUpdateRequest> personalDataUpdateRequests = new ArrayList<>();

    @OneToMany(mappedBy = "citizen", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DocumentIssueRequest> documentIssueRequests = new ArrayList<>();
}

