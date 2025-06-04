//package com.pk.mobywatel.config;
//
//import com.pk.mobywatel.model.*;
//import com.pk.mobywatel.util.Gender;
//import com.pk.mobywatel.util.LicenseCategory;
//import com.pk.mobywatel.util.Role;
//import com.pk.mobywatel.repository.*;
//import jakarta.transaction.Transactional;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.context.annotation.Profile;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Configuration
//@Profile("test")
//public class MockDataConfig {
//
//    @Bean
//    @Transactional
//    CommandLineRunner initDatabase(
//            UserRepository userRepository,
//            CitizenRepository citizenRepository,
//            OfficialRepository officialRepository,
//            DocumentRepository documentRepository,
//            PersonalDataUpdateRequestRepository personalDataUpdateRequestRepository,
//            DocumentIssueRequestRepository documentIssueRequestRepository,
//            BCryptPasswordEncoder encoder) {
//        return args -> {
//            // Clear all tables (assuming this mimics your database clearing logic)
//            documentIssueRequestRepository.deleteAll();
//            personalDataUpdateRequestRepository.deleteAll();
//            documentRepository.deleteAll();
//            citizenRepository.deleteAll();
//            officialRepository.deleteAll();
//            userRepository.deleteAll();
//
//            // Create UserModels
//            UserModel citizenUser = UserModel.builder()
//                    .email("citizen@example.com")
//                    .password(encoder.encode("EncodedPassword123!"))
//                    .role(Role.CITIZEN)
//                    .build();
//            UserModel officialUser = UserModel.builder()
//                    .email("official@example.com")
//                    .password(encoder.encode("EncodedPassword456#"))
//                    .role(Role.OFFICIAL)
//                    .build();
//            userRepository.saveAll(List.of(citizenUser, officialUser));
//
//            // Create Citizen
//            Citizen citizen = Citizen.builder()
//                    .user(citizenUser)
//                    .firstName("Jan")
//                    .lastName("Kowalski")
//                    .birthDate(LocalDate.of(1990, 5, 15))
//                    .PESEL("90051512345")
//                    .gender(Gender.MALE)
//                    .documents(List.of())
//                    .build();
//            citizenRepository.save(citizen);
//
//            // Create Official
//            Official official = Official.builder()
//                    .user(officialUser)
//                    .firstName("Anna")
//                    .lastName("Nowak")
//                    .position("Registrar")
//                    .build();
//            officialRepository.save(official);
//
//            // Create Documents
//            IdentityCard identityCard = IdentityCard.builder()
//                    .citizen(citizen)
//                    .photoURL("http://example.com/photo1.jpg")
//                    .issueDate(LocalDate.now().minusYears(1))
//                    .expirationDate(LocalDate.now().plusYears(9))
//                    .issueAuthority(official)
//                    .lost(false)
//                    .citizenship("Polish")
//                    .build();
//
//            DriverLicense driverLicense = DriverLicense.builder()
//                    .citizen(citizen)
//                    .photoURL("http://example.com/photo2.jpg")
//                    .issueDate(LocalDate.now().minusYears(2))
//                    .expirationDate(LocalDate.now().plusYears(8))
//                    .issueAuthority(official)
//                    .lost(false)
//                    .categories(List.of(LicenseCategory.B))
//                    .build();
//
//            // Update Citizen's documents
//            documentRepository.saveAll(List.of(identityCard, driverLicense));
//
//            // Create PersonalDataUpdateRequest
//            PersonalDataUpdateRequest updateRequest = PersonalDataUpdateRequest.builder()
//                    .citizen(citizen)
//                    .requestedFirstName("Janusz")
//                    .requestedLastName("Kowalski")
//                    .requestedGender(Gender.MALE)
//                    .approved(false)
//                    .processed(false)
//                    .requestDate(LocalDate.now())
//                    .build();
//            personalDataUpdateRequestRepository.save(updateRequest);
//
//            // Create DocumentIssueRequests
//            IdentityCardIssueRequest idCardRequest = IdentityCardIssueRequest.builder()
//                    .citizen(citizen)
//                    .processed(false)
//                    .photoURL("http://example.com/newphoto.jpg")
//                    .approved(false)
//                    .citizenship("Polish")
//                    .build();
//
//            DriverLicenseIssueRequest driverLicenseRequest = DriverLicenseIssueRequest.builder()
//                    .citizen(citizen)
//                    .processed(false)
//                    .photoURL("http://example.com/newphoto2.jpg")
//                    .approved(false)
//                    .categories(List.of(LicenseCategory.A, LicenseCategory.B))
//                    .build();
//            documentIssueRequestRepository.saveAll(List.of(idCardRequest, driverLicenseRequest));
//        };
//    }
//}