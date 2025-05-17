package com.pk.mobywatel.controllers;

import com.pk.mobywatel.response.OfficialDto;
import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.request.OfficialBody;
import com.pk.mobywatel.response.ApiResponse;
import com.pk.mobywatel.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Secured("ROLE_ADMIN")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/official")
    public ResponseEntity<OfficialDto> createOfficialAccount(@RequestParam Integer officialID) throws BadRequestException {
        return ResponseEntity.ok(adminService.fetchOfficialAccount(officialID));
    }

    @PostMapping("/official")
    public ResponseEntity<ApiResponse> createOfficialAccount(@RequestBody OfficialBody body) throws BadRequestException {
        adminService.createOfficialAccount(body);
        return ResponseEntity.ok(new ApiResponse(true, "Official account created"));
    }

    @PutMapping("/official")
    public ResponseEntity<ApiResponse> updateOfficialAccount(@RequestBody OfficialBody body) throws BadRequestException {
        adminService.updateOfficialAccount(body);
        return ResponseEntity.ok(new ApiResponse(true, "Official account updated"));
    }

    @DeleteMapping("/official")
    public ResponseEntity<ApiResponse> deleteOfficialAccount(@RequestParam Integer officialID) throws BadRequestException {
        adminService.deleteOfficialAccount(officialID);
        return ResponseEntity.ok(new ApiResponse(true, "Official account deleted"));
    }

    // TESTING
    @GetMapping("/officials")
    public ResponseEntity<List<OfficialDto>> getOfficials(){
        return ResponseEntity.ok(adminService.fetchOfficialsData());
    }
}
