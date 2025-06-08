package com.pk.mobywatel.config;

import com.pk.mobywatel.model.*;
import com.pk.mobywatel.repository.*;
import com.pk.mobywatel.util.Gender;
import com.pk.mobywatel.util.LicenseCategory;
import com.pk.mobywatel.util.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class MockDataConfig {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            CitizenRepository citizenRepository,
            OfficialRepository officialRepository,
            DocumentRepository documentRepository,
            DocumentIssueRequestRepository documentIssueRequestRepository,
            PersonalDataUpdateRequestRepository personalDataUpdateRequestRepository
    ) {
        return args -> {
            // Create Officials
            UserModel officialUser1 = UserModel.builder()
                    .email("official1@gov.pl")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.OFFICIAL)
                    .build();

            UserModel officialUser2 = UserModel.builder()
                    .email("official2@gov.pl")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.OFFICIAL)
                    .build();

            Official official1 = Official.builder()
                    .user(officialUser1)
                    .firstName("Anna")
                    .lastName("Kowalska")
                    .position("Document Officer")
                    .build();

            Official official2 = Official.builder()
                    .user(officialUser2)
                    .firstName("Piotr")
                    .lastName("Nowak")
                    .position("License Administrator")
                    .build();

            officialRepository.saveAll(Arrays.asList(official1, official2));

            // Create Citizens
            UserModel citizenUser1 = UserModel.builder()
                    .email("jan.kowalski@email.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.CITIZEN)
                    .build();

            UserModel citizenUser2 = UserModel.builder()
                    .email("maria.nowak@email.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.CITIZEN)
                    .build();

            UserModel citizenUser3 = UserModel.builder()
                    .email("adam.wisniewski@email.com")
                    .password(passwordEncoder.encode("Password123!"))
                    .role(Role.CITIZEN)
                    .build();

            Citizen citizen1 = Citizen.builder()
                    .user(citizenUser1)
                    .firstName("Jan")
                    .lastName("Kowalski")
                    .birthDate(LocalDate.of(1985, 5, 15))
                    .PESEL("85051546998")
                    .gender(Gender.MALE)
                    .build();

            Citizen citizen2 = Citizen.builder()
                    .user(citizenUser2)
                    .firstName("Maria")
                    .lastName("Nowak")
                    .birthDate(LocalDate.of(1990, 8, 22))
                    .PESEL("90082281655")
                    .gender(Gender.FEMALE)
                    .build();

            Citizen citizen3 = Citizen.builder()
                    .user(citizenUser3)
                    .firstName("Adam")
                    .lastName("Wiśniewski")
                    .birthDate(LocalDate.of(1978, 12, 3))
                    .PESEL("78120393333")
                    .gender(Gender.MALE)
                    .build();

//            citizenRepository.saveAll(Arrays.asList(citizen1, citizen2, citizen3));
            citizenRepository.save(citizen1);
            citizenRepository.save(citizen2);
            citizenRepository.save(citizen3);

            // Refresh entities to get managed instances
            Citizen managedCitizen1 = citizenRepository.findById(citizen1.getCitizenID()).orElseThrow();
            Citizen managedCitizen2 = citizenRepository.findById(citizen2.getCitizenID()).orElseThrow();
            Citizen managedCitizen3 = citizenRepository.findById(citizen3.getCitizenID()).orElseThrow();
            Official managedOfficial1 = officialRepository.findById(official1.getOfficialID()).orElseThrow();
            Official managedOfficial2 = officialRepository.findById(official2.getOfficialID()).orElseThrow();

            // Create Identity Cards
            IdentityCard identityCard1 = IdentityCard.builder()
                    .citizen(managedCitizen1)
                    .photoURL("https://example.com/photos/jan_kowalski.jpg")
                    .issueDate(LocalDate.of(2020, 3, 10))
                    .expirationDate(LocalDate.of(2030, 3, 10))
                    .issueAuthority(managedOfficial1)
                    .lost(false)
                    .citizenship("Polish")
                    .build();

            IdentityCard identityCard2 = IdentityCard.builder()
                    .citizen(managedCitizen2)
                    .photoURL("https://example.com/photos/maria_nowak.jpg")
                    .issueDate(LocalDate.of(2019, 7, 5))
                    .expirationDate(LocalDate.of(2029, 7, 5))
                    .issueAuthority(managedOfficial1)
                    .lost(false)
                    .citizenship("Polish")
                    .build();

            documentRepository.saveAll(Arrays.asList(identityCard1, identityCard2));
            documentRepository.save(identityCard1);
            documentRepository.save(identityCard2);

            // Create Driver Licenses
            DriverLicense driverLicense1 = DriverLicense.builder()
                    .citizen(managedCitizen1)
                    .photoURL("https://example.com/photos/jan_kowalski_license.jpg")
                    .issueDate(LocalDate.of(2021, 6, 15))
                    .expirationDate(LocalDate.of(2036, 6, 15))
                    .issueAuthority(managedOfficial2)
                    .lost(false)
                    .categories(Arrays.asList(LicenseCategory.B, LicenseCategory.A1))
                    .build();

            DriverLicense driverLicense2 = DriverLicense.builder()
                    .citizen(managedCitizen3)
                    .photoURL("https://example.com/photos/adam_wisniewski_license.jpg")
                    .issueDate(LocalDate.of(2018, 4, 20))
                    .expirationDate(LocalDate.of(2033, 4, 20))
                    .issueAuthority(managedOfficial2)
                    .lost(true) // This license is marked as lost
                    .categories(Arrays.asList(LicenseCategory.B, LicenseCategory.C, LicenseCategory.D))
                    .build();

//            documentRepository.saveAll(Arrays.asList(driverLicense1, driverLicense2));
            documentRepository.save(driverLicense1);
            documentRepository.save(driverLicense2);

            // Create Document Issue Requests
            IdentityCardIssueRequest idCardRequest1 = IdentityCardIssueRequest.builder()
                    .citizen(managedCitizen3)
                    .processed(false)
                    .photoURL("https://example.com/photos/adam_wisniewski_new.jpg")
                    .approved(false)
                    .citizenship("Polish")
                    .build();

            DriverLicenseIssueRequest driverLicenseRequest1 = DriverLicenseIssueRequest.builder()
                    .citizen(managedCitizen2)
                    .processed(true)
                    .photoURL("https://example.com/photos/maria_nowak_license.jpg")
                    .approved(true)
                    .categories(Arrays.asList(LicenseCategory.B))
                    .build();

            DriverLicenseIssueRequest driverLicenseRequest2 = DriverLicenseIssueRequest.builder()
                    .citizen(managedCitizen3)
                    .processed(true)
                    .photoURL("https://example.com/photos/adam_wisniewski_license_new.jpg")
                    .approved(false) // Rejected request
                    .categories(Arrays.asList(LicenseCategory.B, LicenseCategory.C, LicenseCategory.D))
                    .build();

//            documentIssueRequestRepository.saveAll(Arrays.asList(
//                    idCardRequest1, driverLicenseRequest1, driverLicenseRequest2
//            ));
            documentIssueRequestRepository.save(idCardRequest1);
            documentIssueRequestRepository.save(driverLicenseRequest1);
            documentIssueRequestRepository.save(driverLicenseRequest2);

            // Create Personal Data Update Requests
            PersonalDataUpdateRequest dataUpdateRequest1 = PersonalDataUpdateRequest.builder()
                    .citizen(managedCitizen1)
                    .requestedFirstName("Jan")
                    .requestedLastName("Kowalski-Nowak") // Name change after marriage
                    .requestedGender(Gender.MALE)
                    .approved(false)
                    .processed(false)
                    .requestDate(LocalDate.now().minusDays(5))
                    .build();

            PersonalDataUpdateRequest dataUpdateRequest2 = PersonalDataUpdateRequest.builder()
                    .citizen(managedCitizen2)
                    .requestedFirstName("Maria")
                    .requestedLastName("Kowalska") // Name change after marriage
                    .requestedGender(Gender.FEMALE)
                    .approved(true)
                    .processed(true)
                    .requestDate(LocalDate.now().minusDays(15))
                    .build();

            personalDataUpdateRequestRepository.saveAll(Arrays.asList(
                    dataUpdateRequest1, dataUpdateRequest2
            ));

            System.out.println("Mock data has been successfully loaded!");
            System.out.println("Test users created:");
            System.out.println("Citizens: jan.kowalski@email.com, maria.nowak@email.com, adam.wisniewski@email.com");
            System.out.println("Officials: official1@gov.pl, official2@gov.pl");
            System.out.println("All passwords: Password123!");
        };
    }
}