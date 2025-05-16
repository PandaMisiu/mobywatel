package com.pk.mobywatel.controllers;

import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/officials")
    public ResponseEntity<List<Official>> getOfficials(){
        return ResponseEntity.ok(adminService.fetchOfficialsData());
    }
}
