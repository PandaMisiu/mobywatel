package com.pk.mobywatel.model;

import com.pk.mobywatel.util.EncryptionConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Official {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true, nullable = false)
    private Integer officialID;

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
    @Convert(converter = EncryptionConverter.class)
    private String position;

    @OneToMany(mappedBy = "issueAuthority", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Document> documents = new ArrayList<>();
}
