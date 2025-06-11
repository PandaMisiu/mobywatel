package com.pk.mobywatel.model;

import com.pk.mobywatel.util.EncryptionConverter;
import com.pk.mobywatel.util.LicenseCategory;
import com.pk.mobywatel.util.RequestedDocument;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Inheritance(strategy = InheritanceType.JOINED)
public class DocumentIssueRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer requestID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "citizenID")
    private Citizen citizen;

    @Column(nullable = false)
    private Boolean processed;

    @Column(nullable = false)
    private Boolean approved;
}
