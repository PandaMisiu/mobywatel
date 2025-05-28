package com.pk.mobywatel.controllers;

import com.pk.mobywatel.request.CitizenBody;
import com.pk.mobywatel.response.ApiResponse;
import com.pk.mobywatel.response.CitizenDto;
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
    public ResponseEntity<CitizenDto> getCitizenByID(@RequestParam Integer citizenID) throws BadRequestException {
        return ResponseEntity.ok(officialService.fetchCitizenAccount(citizenID));
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

    @GetMapping("/citizens/requests")
    public ResponseEntity<List<PersonaDataUpdateRequestDto>> getUpdateRequests() {
        return ResponseEntity.ok(officialService.getUpdateRequests());
    }
}
