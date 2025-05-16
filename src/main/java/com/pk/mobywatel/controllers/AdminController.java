package com.pk.mobywatel.controllers;

import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.request.OfficialBody;
import com.pk.mobywatel.response.ApiResponse;
import com.pk.mobywatel.service.AdminService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping("/create/official")
    public ResponseEntity<ApiResponse> createOfficialAccount(@RequestBody OfficialBody body){
        adminService.createOfficialAccount(body);
        return ResponseEntity.ok(new ApiResponse(true, "Official account created"));
    }

    @PutMapping("/update/official")
    public ResponseEntity<ApiResponse> updateOfficialAccount(@RequestBody OfficialBody body){
        adminService.updateOfficialAccount(body);
        return ResponseEntity.ok(new ApiResponse(true, "Official account updated"));
    }


    // TESTING
    @GetMapping("/officials")
    public ResponseEntity<List<Official>> getOfficials(){
        return ResponseEntity.ok(adminService.fetchOfficialsData());
    }
}
