package com.pk.mobywatel.controllers;

import com.pk.mobywatel.request.LoginBody;
import com.pk.mobywatel.request.RegisterBody;
import com.pk.mobywatel.request.ValidationRequest;
import com.pk.mobywatel.response.ApiResponse;
import com.pk.mobywatel.response.AuthenticationResponse;
import com.pk.mobywatel.response.ValidationResponse;
import com.pk.mobywatel.service.AuthService;
import com.pk.mobywatel.service.JwtService;
import com.pk.mobywatel.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody RegisterBody body) throws BadRequestException {
        userService.register(body);
        return ResponseEntity.ok(new ApiResponse(true, "Register successful"));
    }


    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginBody request, HttpServletResponse response) throws BadRequestException {
        return ResponseEntity.ok(authService.login(request, response));
    }

    @PostMapping("/validate-token")
    public ResponseEntity<ValidationResponse> validateTokenFromString(@RequestBody ValidationRequest request) throws BadRequestException {
        String token = request.token();

        authService.validateToken(token);

        // username w kontekscie jwt, w tym przypadku email
        String email = jwtService.extractUsername(token);
        int userID = userService.getUserIDFromEmail(email);
        return ResponseEntity.ok(ValidationResponse.builder()
                .valid(true)
                .email(email)
                .userID(userID)
                .roles(authService.getRoles())
                .message("Validation successful")
                .build());
    }

    @PostMapping("/validate-cookie")
    public ResponseEntity<ValidationResponse> validateTokenFromCookie(HttpServletRequest request) throws BadRequestException {
            Cookie[] cookies = request.getCookies();
            Optional<String> jwtToken = Arrays.stream(cookies != null ? cookies : new Cookie[0])
                    .filter(cookie -> cookie != null && "jwt".equals(cookie.getName()))
                    .map(Cookie::getValue)
                    .findFirst();

            if (jwtToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ValidationResponse.builder()
                        .valid(false)
                        .email("")
                        .userID(null)
                        .roles(new String[0])
                        .message("No JWT cookie found")
                        .build());
            }


            authService.validateToken(jwtToken.get());

            String email = jwtService.extractUsername(jwtToken.get());
            int userID = userService.getUserIDFromEmail(email);

            return ResponseEntity.ok(ValidationResponse.builder()
                    .valid(true)
                    .email(jwtService.extractUsername(jwtToken.get()))
                    .userID(userID)
                    .roles(authService.getRoles())
                    .message("Validation successful")
                    .build());
    }
}
