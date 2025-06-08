package com.pk.mobywatel.service;

import com.pk.mobywatel.model.*;
import com.pk.mobywatel.repository.*;
import com.pk.mobywatel.request.CitizenBody;
import com.pk.mobywatel.request.DocumentIssueBody;
import com.pk.mobywatel.request.ProcessDocumentIssueBody;
import com.pk.mobywatel.request.ProcessPersonalDataUpdateBody;
import com.pk.mobywatel.response.*;
import com.pk.mobywatel.util.Gender;
import com.pk.mobywatel.util.LicenseCategory;
import com.pk.mobywatel.util.RequestedDocument;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import pl.unak7.peselvalidator.GenderEnum;
import pl.unak7.peselvalidator.PeselValidator;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OfficialService {

    private final CitizenRepository citizenRepository;
    private final PersonalDataUpdateRequestRepository personalDataUpdateRequestRepository;
    private final DataValidator validator;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final PeselValidator peselValidator;
    private final DocumentIssueRequestRepository documentIssueRequestRepository;
    private final DocumentRepository documentRepository;
    private final JwtService jwtService;
    private final OfficialRepository officialRepository;

    @Transactional
    public void updateCitizenAccount(CitizenBody body) throws BadRequestException {

        if(body.citizenID() == null) throw new BadRequestException("Citizen ID is required");

        Citizen citizen = citizenRepository.findById(body.citizenID()).orElseThrow(() -> new BadRequestException("Citizen not found"));
        UserModel user = citizen.getUser();

        // Jeśli pole jest null lub składa sie z białych znaków to jest pomijane (nie wyrzuca błędu)
        if(validator.validateUpdateField(body.email())){
            if(validator.checkEmailRegex(body.email())){
                if(!body.email().equals(user.getEmail()) && validator.checkIfEmailIsTaken(body.email())) throw new BadRequestException("Email is taken");
                user.setEmail(body.email());
            }
            else throw new BadRequestException("Invalid email");
        }

        if(validator.validateUpdateField(body.password())){
            if(validator.checkPasswordRegex(body.password())) user.setPassword(passwordEncoder.encode(body.password()));
            else throw new BadRequestException("Invalid password");
        }

        if(validator.validateUpdateField(body.firstName())) citizen.setFirstName(body.firstName());

        if(validator.validateUpdateField(body.lastName())) citizen.setLastName(body.lastName());

        // Przy aktualizacji sprawdzane jest czy data urodzenia, pesel i płeć są ze sobą zgodne
        GenderEnum peselGender;
        Gender updateGender;
        String updatePESEL;
        LocalDate updateBirthDate;

        if(validator.validateUpdateField(body.gender())) updateGender = body.gender();
        else updateGender = citizen.getGender();

        if(updateGender == Gender.MALE) peselGender = GenderEnum.MALE;
        else peselGender = GenderEnum.FEMALE;

        if(validator.validateUpdateField(body.birthDate())){
            if (body.birthDate().isAfter(LocalDate.now())) {
                throw new BadRequestException("Birth date is after current date.");
            }
            updateBirthDate = body.birthDate();
        }
        else updateBirthDate = LocalDate.now();

        if(validator.validateUpdateField(body.PESEL())) {
            if(!body.PESEL().equals(citizen.getPESEL()) && validator.checkIfPESELIsTaken(body.PESEL())) throw new BadRequestException("PESEL is taken.");
            updatePESEL = body.PESEL();
            if (!peselValidator.validate(updatePESEL, updateBirthDate, peselGender)) throw new BadRequestException("The birth date and gender must match the PESEL.");
        }
        else updatePESEL = citizen.getPESEL();

        citizen.setPESEL(updatePESEL);
        citizen.setBirthDate(updateBirthDate);
        citizen.setGender(updateGender);

        userRepository.save(user);
        citizenRepository.save(citizen);
    }

    public List<CitizenDto> fetchCitizens(){
        List<CitizenDto> citizens = citizenRepository.findAll()
                .stream()
                .map(citizen -> new CitizenDto(
                        citizen.getCitizenID(),
                        citizen.getFirstName(),
                        citizen.getLastName(),
                        citizen.getBirthDate(),
                        citizen.getPESEL(),
                        citizen.getGender(),
                        citizen.getUser().getEmail()
                ))
                .toList();

        return citizens;
    }

    @Transactional
    public void deleteCitizenAccount(Integer citizenID) throws BadRequestException {
        Citizen citizen = citizenRepository.findById(citizenID).orElseThrow(() ->new BadRequestException("Citizen not found"));
        citizenRepository.delete(citizen);
    }

    public CitizenDto fetchCitizenAccount(Integer officialID) throws BadRequestException {
        Citizen citizen = citizenRepository.findById(officialID).orElseThrow(() ->new BadRequestException("Citizen not found"));

        return new CitizenDto(
                citizen.getCitizenID(),
                citizen.getFirstName(),
                citizen.getLastName(),
                citizen.getBirthDate(),
                citizen.getPESEL(),
                citizen.getGender(),
                citizen.getUser().getEmail());
    }

    public CitizenDto fetchCitizenAccount(String PESEL) throws BadRequestException {
        validator.validatePESEL(PESEL);

        Citizen citizen = citizenRepository.findByPESEL(PESEL).orElseThrow(() ->new BadRequestException("Citizen not found"));

        return new CitizenDto(
                citizen.getCitizenID(),
                citizen.getFirstName(),
                citizen.getLastName(),
                citizen.getBirthDate(),
                citizen.getPESEL(),
                citizen.getGender(),
                citizen.getUser().getEmail());
    }

    public List<PersonaDataUpdateRequestDto> getUpdateRequests() {
        return personalDataUpdateRequestRepository.findAll().stream()
                .map(request -> {
                    if (!request.getProcessed())
                        return new PersonaDataUpdateRequestDto(
                                request.getRequestID(),
                                request.getCitizen().getCitizenID(),
                                request.getRequestedFirstName(),
                                request.getRequestedLastName(),
                                request.getRequestedGender(),
                                request.getApproved(),
                                false,
                                request.getRequestDate()
                        );
                    else
                        return null;
                })
                .filter(Objects::nonNull)
                .toList();
    }

    public void personalDataUpdate(ProcessPersonalDataUpdateBody body) throws BadRequestException {
        PersonalDataUpdateRequest personalDataUpdateRequest = personalDataUpdateRequestRepository.findById(body.requestID())
                .orElseThrow(() -> new BadRequestException("Personal data update request not found."));

        if (personalDataUpdateRequest.getProcessed().equals(true)) {
            throw new BadRequestException("Personal data update has already been processed.");
        }

        if (body.approval()) {
            Citizen citizen = citizenRepository.findById(personalDataUpdateRequest.getCitizen().getCitizenID())
                    .orElseThrow(() -> new BadRequestException("Citizen not found"));

            citizen.setFirstName((personalDataUpdateRequest.getRequestedFirstName()) != null ? personalDataUpdateRequest.getRequestedFirstName() : citizen.getFirstName());
            citizen.setLastName((personalDataUpdateRequest.getRequestedLastName()) != null ? personalDataUpdateRequest.getRequestedLastName() : citizen.getLastName());
            citizen.setGender((personalDataUpdateRequest.getRequestedGender()) != null ? personalDataUpdateRequest.getRequestedGender() : citizen.getGender());

            citizenRepository.save(citizen);
        }

        personalDataUpdateRequestRepository.updatePersonalDataRequest(body.requestID(), body.approval());
    }

    public List<DocumentIssueRequestDto> getDocumentIssueRequests() {
        return documentIssueRequestRepository.findAll().stream()
                .map(request -> {
                    if (!request.getProcessed())
                        return mapToDto(request);
                    else
                        return null;
                })
                .filter(Objects::nonNull)
                .toList();
    }

    private DocumentIssueRequestDto mapToDto(DocumentIssueRequest documentIssueRequest) {
        if (documentIssueRequest instanceof DriverLicenseIssueRequest dl) {
            return DriverLicenseIssueDto.builder()
                    .requestID(dl.getRequestID())
                    .citizenID(dl.getCitizen().getCitizenID())
                    .photoURL(dl.getPhotoURL())
                    .type(RequestedDocument.DRIVER_LICENSE)
                    .categories(dl.getCategories().stream().sorted().toList())
                    .build();
        } else if (documentIssueRequest instanceof IdentityCardIssueRequest ic) {
            return IdentityCardIssueDto.builder()
                    .requestID(ic.getRequestID())
                    .citizenID(ic.getCitizen().getCitizenID())
                    .photoURL(ic.getPhotoURL())
                    .type(RequestedDocument.IDENTITY_CARD)
                    .citizenship(ic.getCitizenship())
                    .build();
        } else {
            throw new IllegalArgumentException("Unknown document issue type: " + documentIssueRequest.getClass());
        }
    }

    public void documentIssueRequest(ProcessDocumentIssueBody body, String token) throws BadRequestException {
        DocumentIssueRequest documentIssueRequest = documentIssueRequestRepository.findById(body.requestID())
                .orElseThrow(() -> new BadRequestException("Personal data update request not found."));

        if (documentIssueRequest.getProcessed().equals(true)) {
            throw new BadRequestException("Personal data update has already been processed.");
        }

        if (body.approval()) {
            UserModel officialUser = userRepository.findByEmail(jwtService.extractUsername(token))
                    .orElseThrow(() -> new BadRequestException("Official user not found."));

            Official official = officialRepository.findByUser(officialUser)
                    .orElseThrow(() -> new BadRequestException("Official not found."));

            Optional<List<Document>> documentOptional = documentRepository.findByCitizen(documentIssueRequest.getCitizen());

            if (documentIssueRequest instanceof IdentityCardIssueRequest) {
                IdentityCard identityCard;

                if (documentOptional.isPresent() && documentOptional.get().stream().anyMatch(doc -> doc instanceof IdentityCard)) {
                    identityCard = (IdentityCard) documentOptional.get().stream()
                            .filter(doc -> doc instanceof IdentityCard)
                            .findFirst()
                            .get();

                    identityCard.setPhotoURL(documentIssueRequest.getPhotoURL());
                    identityCard.setIssueDate(LocalDate.now());
                    identityCard.setExpirationDate(body.expirationDate());
                    identityCard.setIssueAuthority(official);

                    identityCard.setCitizenship(((IdentityCardIssueRequest) documentIssueRequest).getCitizenship());
                } else {
                    identityCard = IdentityCard.builder()
                            .citizen(documentIssueRequest.getCitizen())
                            .photoURL(documentIssueRequest.getPhotoURL())
                            .issueDate(LocalDate.now())
                            .expirationDate(body.expirationDate())
                            .issueAuthority(official)
                            .lost(false)
                            .citizenship(((IdentityCardIssueRequest) documentIssueRequest).getCitizenship())
                            .build();
                }

                documentRepository.save(identityCard);
            } else if (documentIssueRequest instanceof DriverLicenseIssueRequest) {
                DriverLicense driverLicense;

                if (documentOptional.isPresent() && documentOptional.get().stream().anyMatch(doc -> doc instanceof DriverLicense)) {
                    driverLicense = (DriverLicense) documentOptional.get().stream()
                            .filter(doc -> doc instanceof DriverLicense)
                            .findFirst()
                            .get();

                    driverLicense.setPhotoURL(documentIssueRequest.getPhotoURL());
                    driverLicense.setIssueDate(LocalDate.now());
                    driverLicense.setExpirationDate(body.expirationDate());
                    driverLicense.setIssueAuthority(official);

                    for (LicenseCategory category: ((DriverLicenseIssueRequest) documentIssueRequest).getCategories()) {
                        if (!driverLicense.getCategories().contains(category)) {
                            driverLicense.getCategories().add(category);
                        }
                    }
                } else {
                    driverLicense = DriverLicense.builder()
                            .citizen(documentIssueRequest.getCitizen())
                            .photoURL(documentIssueRequest.getPhotoURL())
                            .issueDate(LocalDate.now())
                            .expirationDate(body.expirationDate())
                            .issueAuthority(official)
                            .lost(false)
                            .categories(((DriverLicenseIssueRequest) documentIssueRequest).getCategories().stream().sorted().toList())
                            .build();
                }

                documentRepository.save(driverLicense);
            }
        }

        documentIssueRequestRepository.documentIssueRequestUpdate(body.requestID(), body.approval());
    }
}
