package com.pk.mobywatel.controllers;

import com.pk.mobywatel.request.CitizenBody;
import com.pk.mobywatel.request.ReportBody;
import com.pk.mobywatel.response.DocumentDto;
import com.pk.mobywatel.service.CitizenService;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/api/citizen")
@AllArgsConstructor
public class CitizenController {
    private final CitizenService citizenService;

    @GetMapping("/docs")
    public ResponseEntity<List<DocumentDto>> getCitizenDocuments(@RequestBody Integer citizenID) throws BadRequestException {
        return ResponseEntity.ok(citizenService.getCitizenDocuments(citizenID));
    }

    @PostMapping("/docs/lost")
    public ResponseEntity<Void> reportLostDocument(@RequestBody ReportBody body) throws BadRequestException {
        citizenService.reportLostDocument(body.citizenID(), body.documentID());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/update")
    public ResponseEntity<Void> requestUpdate(@RequestBody CitizenBody body) throws BadRequestException {
        citizenService.requestUpdatePersonalData(body);
        return ResponseEntity.noContent().build();
    }
}
