package com.pk.mobywatel.controllers;

import com.pk.mobywatel.request.*;
import com.pk.mobywatel.response.ApiResponse;
import com.pk.mobywatel.response.CitizenDto;
import com.pk.mobywatel.response.DocumentDto;
import com.pk.mobywatel.service.CitizenService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/citizen")
@RequiredArgsConstructor
@Secured({"ROLE_CITIZEN", "ROLE_ADMIN"})
public class CitizenController {
    private final CitizenService citizenService;

    @GetMapping("/personalData")
    public ResponseEntity<CitizenDto> getPersonalData(@CookieValue(name = "jwt") String token) throws BadRequestException {
        return ResponseEntity.ok(citizenService.getCitizenPersonalData(token));
    }

    @GetMapping("/docs")
    public ResponseEntity<List<DocumentDto>> getCitizenDocuments(@CookieValue(name = "jwt") String token) throws BadRequestException {
        return ResponseEntity.ok(citizenService.getCitizenDocuments(token));
    }

    @PostMapping("/docs/lost")
    public ResponseEntity<ApiResponse> reportLostDocument(@CookieValue(name = "jwt") String token,
                                                          @RequestParam Integer documentID) throws BadRequestException {
        citizenService.reportLostDocument(documentID, token);
        return ResponseEntity.ok(new ApiResponse(true, "Citizen lost document report sent"));
    }

    @PostMapping("/docs/request")
    public ResponseEntity<ApiResponse> requestDocumentIssue(@CookieValue(name = "jwt") String token,
                                                            @ModelAttribute DocumentIssueBody body,
                                                            @RequestParam MultipartFile photo) throws BadRequestException {
        citizenService.requestDocumentIssue(body, photo, token);
        return ResponseEntity.ok(new ApiResponse(true, "Citizen document issue request report sent"));
    }

    @PostMapping("/personalData/request")
    public ResponseEntity<ApiResponse> requestUpdate(@CookieValue(name = "jwt") String token,
                                                     @RequestBody PersonalDataUpdateBody body) throws BadRequestException {
        citizenService.requestUpdatePersonalData(body, token);
        return ResponseEntity.ok(new ApiResponse(true, "Citizen personal data update request sent"));
    }
}
