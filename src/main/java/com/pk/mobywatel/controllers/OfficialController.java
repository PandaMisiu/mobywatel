package com.pk.mobywatel.controllers;

import com.pk.mobywatel.request.CitizenBody;
import com.pk.mobywatel.request.ProcessDocumentIssueBody;
import com.pk.mobywatel.request.ProcessPersonalDataUpdateBody;
import com.pk.mobywatel.response.ApiResponse;
import com.pk.mobywatel.response.CitizenDto;
import com.pk.mobywatel.response.DocumentIssueRequestDto;
import com.pk.mobywatel.response.PersonaDataUpdateRequestDto;
import com.pk.mobywatel.service.OfficialService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/official")
@RequiredArgsConstructor
@Secured({"ROLE_OFFICIAL", "ROLE_ADMIN"})
public class OfficialController {

    private final OfficialService officialService;

    @GetMapping("/citizen")
    public ResponseEntity<CitizenDto> getCitizenByID(@RequestParam(name = "citizenID", required = false) Integer citizenID,
                                                     @RequestParam(name = "PESEL", required = false) String PESEL) throws BadRequestException {
        if (citizenID != null && PESEL == null)
            return ResponseEntity.ok(officialService.fetchCitizenAccount(citizenID));
        else if (PESEL != null && citizenID == null)
            return ResponseEntity.ok(officialService.fetchCitizenAccount(PESEL));
        else
            throw new BadRequestException("Required 1 parameter, received 2");
    }

    @PutMapping("/citizen")
    public ResponseEntity<ApiResponse> updateCitizenAccount(@RequestBody CitizenBody body) throws BadRequestException {
        officialService.updateCitizenAccount(body);
        return ResponseEntity.ok(new ApiResponse(true, "Citizen account updated"));
    }

    @DeleteMapping("/citizen")
    public ResponseEntity<ApiResponse> deleteCitizenAccount(@RequestParam Integer citizenID) throws BadRequestException {
        officialService.deleteCitizenAccount(citizenID);
        return ResponseEntity.ok(new ApiResponse(true, "citizen account deleted"));
    }

    @GetMapping("/citizens")
    public ResponseEntity<List<CitizenDto>> getCitizens(){
        return ResponseEntity.ok(officialService.fetchCitizens());
    }

    @GetMapping("/citizen/personalData/requests")
    public ResponseEntity<List<PersonaDataUpdateRequestDto>> getUpdateRequests() {
        return ResponseEntity.ok(officialService.getUpdateRequests());
    }

    @PostMapping("/citizen/personalData/request")
    public ResponseEntity<ApiResponse> processPersonalDataUpdate(@RequestBody ProcessPersonalDataUpdateBody body) throws BadRequestException {
        officialService.personalDataUpdate(body);
        return ResponseEntity.ok(new ApiResponse(true, "Successfully process personal data change."));
    }

    @GetMapping("/citizen/docs/requests")
    public ResponseEntity<List<DocumentIssueRequestDto>> getDocumentIssueRequests() {
        return ResponseEntity.ok(officialService.getDocumentIssueRequests());
    }

    @PostMapping("/citizen/docs/request")
    public ResponseEntity<ApiResponse> processDocumentIssueRequest(@CookieValue(name = "jwt") String token,
                                                                   @RequestBody ProcessDocumentIssueBody body) throws BadRequestException {
        officialService.documentIssueRequest(body, token);
        return ResponseEntity.ok(new ApiResponse(true, "Successfully processed document issue"));
    }
}
