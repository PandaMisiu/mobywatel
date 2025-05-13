package com.pk.mobywatel.controllers;

import com.pk.mobywatel.body.LoginBody;
import com.pk.mobywatel.body.RegisterBody;
import com.pk.mobywatel.response.ApiResponse;
import com.pk.mobywatel.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(RegisterBody body){
        authService.register(body);
        return ResponseEntity.ok(new ApiResponse(true, "Register successful"));
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(LoginBody body){
        authService.login(body);
        return ResponseEntity.ok(new ApiResponse(true, "Register successful"));
    }
}
