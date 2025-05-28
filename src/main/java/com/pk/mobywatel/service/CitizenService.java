package com.pk.mobywatel.service;

import com.pk.mobywatel.model.*;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.DocumentRepository;
import com.pk.mobywatel.repository.PersonalDataUpdateRequestRepository;
import com.pk.mobywatel.request.CitizenBody;
import com.pk.mobywatel.response.DocumentDto;
import com.pk.mobywatel.response.DriverLicenseDto;
import com.pk.mobywatel.response.IdentityCardDto;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CitizenService {

    private final CitizenRepository citizenRepository;
    private final DocumentRepository documentRepository;
    private final PersonalDataUpdateRequestRepository personalDataUpdateRequestRepository;

    public List<DocumentDto> getCitizenDocuments(Integer citizenID) throws BadRequestException {
        var citizen = citizenRepository.findById(citizenID).orElseThrow(
                () -> new BadRequestException("Citizen not found")
        );

        return citizen.getDocuments().stream().map(this::mapToDto).toList();
    }

    public void reportLostDocument(Integer citizenID, Integer documentID) throws BadRequestException {
        var document = documentRepository.findById(documentID).orElseThrow(
                () -> new BadRequestException("Document not found")
        );

        if(!document.getCitizen().getCitizenID().equals(citizenID)) {
            throw new BadRequestException("Document does not belong to citizen");
        }

        document.setLost(true);
        documentRepository.save(document);
    }

    public void requestUpdatePersonalData(CitizenBody body) throws BadRequestException {
        Citizen citizen = citizenRepository.findById(body.citizenID())
                .orElseThrow(() -> new BadRequestException("Citizen not found"));

        PersonalDataUpdateRequest request = PersonalDataUpdateRequest.builder()
                .citizen(citizen)
                .requestedFirstName(body.firstName())
                .requestedLastName(body.lastName())
                .requestedBirthDate(body.birthDate())
                .requestedGender(body.gender())
                .approved(false)
                .processed(false)
                .requestDate(LocalDate.now())
                .build();

        personalDataUpdateRequestRepository.save(request);
    }

    private DocumentDto mapToDto(Document document) {
        if (document instanceof DriverLicense dl) {
            DriverLicenseDto dto = new DriverLicenseDto();
            dto.setDocumentID(dl.getDocumentID());
            dto.setIssueDate(dl.getIssueDate());
            dto.setExpirationDate(dl.getExpirationDate());
            dto.setPhotoURL(dl.getPhotoURL());
            dto.setLost(dl.getLost());
            dto.setCategories(dl.getCategories());
            dto.setType("DRIVER_LICENSE");
            return dto;
        } else if (document instanceof IdentityCard ic) {
            IdentityCardDto dto = new IdentityCardDto();
            dto.setDocumentID(ic.getDocumentID());
            dto.setIssueDate(ic.getIssueDate());
            dto.setExpirationDate(ic.getExpirationDate());
            dto.setPhotoURL(ic.getPhotoURL());
            dto.setLost(ic.getLost());
            dto.setCitizenship(ic.getCitizenship());
            dto.setType("IDENTITY_CARD");
            return dto;
        } else {
            throw new IllegalArgumentException("Unknown document type: " + document.getClass());
        }
    }
}
