package com.pk.mobywatel.service;

import com.pk.mobywatel.model.*;
import com.pk.mobywatel.repository.*;
import com.pk.mobywatel.request.CitizenBody;
import com.pk.mobywatel.request.DocumentIssueBody;
import com.pk.mobywatel.request.PersonalDataUpdateBody;
import com.pk.mobywatel.request.RegisterBody;
import com.pk.mobywatel.response.CitizenDto;
import com.pk.mobywatel.response.DocumentDto;
import com.pk.mobywatel.response.DriverLicenseDto;
import com.pk.mobywatel.response.IdentityCardDto;
import com.pk.mobywatel.util.RequestedDocument;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.unak7.peselvalidator.PeselValidator;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CitizenService {

    private final CitizenRepository citizenRepository;
    private final DocumentRepository documentRepository;
    private final PersonalDataUpdateRequestRepository personalDataUpdateRequestRepository;
    private final DataValidator validator;
    private final DocumentIssueRequestRepository documentIssueRequestRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final FilesystemService filesystemService;

    public CitizenDto getCitizenPersonalData(String token) throws BadRequestException {
        UserModel citizenUserModel = userRepository.findByEmail(jwtService.extractUsername(token))
                .orElseThrow(() -> new BadRequestException("User not found"));

        var citizen = citizenRepository.findByUser(citizenUserModel).orElseThrow(
                () -> new BadRequestException("Citizen not found")
        );

        return new CitizenDto(
                citizen.getCitizenID(),
                citizen.getFirstName(),
                citizen.getLastName(),
                citizen.getBirthDate(),
                citizen.getPESEL(),
                citizen.getGender(),
                citizenUserModel.getEmail()
        );
    }

    public List<DocumentDto> getCitizenDocuments(String token) throws BadRequestException {
        UserModel citizenUserModel = userRepository.findByEmail(jwtService.extractUsername(token))
                .orElseThrow(() -> new BadRequestException("User not found"));

        var citizen = citizenRepository.findByUser(citizenUserModel).orElseThrow(
                () -> new BadRequestException("Citizen not found")
        );

        return citizen.getDocuments().stream().map(this::mapToDto).toList();
    }

    public void reportLostDocument(Integer documentID, String token) throws BadRequestException {
        var document = documentRepository.findById(documentID).orElseThrow(
                () -> new BadRequestException("Document not found")
        );

        UserModel citizenUserModel = userRepository.findByEmail(jwtService.extractUsername(token))
                .orElseThrow(() -> new BadRequestException("User not found"));

        Citizen citizen = citizenRepository.findByUser(citizenUserModel)
                .orElseThrow(() -> new BadRequestException("Citizen not found"));

        if(!document.getCitizen().getCitizenID().equals(citizen.getCitizenID())) {
            throw new BadRequestException("Document does not belong to citizen");
        }

        document.setLost(true);
        documentRepository.save(document);
    }

    public void requestUpdatePersonalData(PersonalDataUpdateBody body, String token) throws BadRequestException {
        UserModel citizenUserModel = userRepository.findByEmail(jwtService.extractUsername(token))
                .orElseThrow(() -> new BadRequestException("User not found"));

        Citizen citizen = citizenRepository.findByUser(citizenUserModel)
                .orElseThrow(() -> new BadRequestException("Citizen not found"));

        PersonalDataUpdateRequest request = PersonalDataUpdateRequest.builder()
                .citizen(citizen)
                .requestedFirstName(body.requestedFirstName())
                .requestedLastName(body.requestedLastName())
                .requestedGender(body.requestedGender())
                .approved(false)
                .processed(false)
                .requestDate(LocalDate.now())
                .build();

        personalDataUpdateRequestRepository.save(request);
    }

    public void requestDocumentIssue(DocumentIssueBody body, MultipartFile photo, String token) throws BadRequestException {
        validator.validateCitizenDocumentIssueData(body);

        UserModel citizenUserModel = userRepository.findByEmail(jwtService.extractUsername(token))
                .orElseThrow(() -> new BadRequestException("User not found"));

        Citizen citizen = citizenRepository.findByUser(citizenUserModel)
                .orElseThrow(() -> new BadRequestException("Citizen not found"));

        if (body.requestedDocument() == RequestedDocument.IDENTITY_CARD) {
            IdentityCardIssueRequest request = IdentityCardIssueRequest.builder()
                    .citizen(citizen)
                    .citizenship(body.citizenship().toUpperCase())
                    .processed(false)
                    .approved(false)
                    .build();

            documentIssueRequestRepository.save(request);

            filesystemService.storeRequest(request.getCitizen().getCitizenID(), request.getRequestID(), photo);
        } else {
            DriverLicenseIssueRequest request = DriverLicenseIssueRequest.builder()
                    .citizen(citizen)
                    .categories(body.licenseCategory())
                    .processed(false)
                    .approved(false)
                    .build();

            documentIssueRequestRepository.save(request);

            filesystemService.storeRequest(request.getCitizen().getCitizenID(), request.getRequestID(), photo);
        }
    }

    private DocumentDto mapToDto(Document document) {
        if (document instanceof DriverLicense dl) {
            DriverLicenseDto dto = new DriverLicenseDto();
            dto.setDocumentID(dl.getDocumentID());
            dto.setIssueDate(dl.getIssueDate());
            dto.setExpirationDate(dl.getExpirationDate());
            dto.setLost(dl.getLost());
            dto.setCategories(dl.getCategories().stream().sorted().toList());
            dto.setType("DRIVER_LICENSE");
            return dto;
        } else if (document instanceof IdentityCard ic) {
            IdentityCardDto dto = new IdentityCardDto();
            dto.setDocumentID(ic.getDocumentID());
            dto.setIssueDate(ic.getIssueDate());
            dto.setExpirationDate(ic.getExpirationDate());
            dto.setLost(ic.getLost());
            dto.setCitizenship(ic.getCitizenship());
            dto.setType("IDENTITY_CARD");
            return dto;
        } else {
            throw new IllegalArgumentException("Unknown document type: " + document.getClass());
        }
    }
}
