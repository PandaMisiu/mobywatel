package com.pk.mobywatel.service;

import com.pk.mobywatel.request.LoginBody;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.response.AuthenticationResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;



    public AuthenticationResponse login(LoginBody request, HttpServletResponse response) throws BadRequestException {
        String email = request.email(),
                password = request.password();

        if (email == null || password == null){
            throw new BadRequestException("Missing field.");
        }

        if (email.isBlank() || password.isBlank()) {
            throw new BadRequestException("A field is blank.");
        }

        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";

        if (!email.matches(emailRegex)) {
            throw new BadRequestException("Incorrect email.");
        }

        UserModel user = userRepository.findByEmail(request.email()).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,"User not found"));
        Authentication authentication = authenticationManager
                .authenticate(
                     new UsernamePasswordAuthenticationToken(
                             request.email(),
                             request.password()
                     )
                );
        if(authentication.isAuthenticated()){
            String token = jwtService.generateToken(user);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            Cookie cookie = new Cookie("jwt", token);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60); // 7 days

            response.addCookie(cookie);

            return AuthenticationResponse.builder()
                    .success(true)
                    .message("Login Successful")
                    .userID(user.getUserID())
                    .build();
        }
        else {
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    public void validateToken(String token) throws BadRequestException {
        if (token == null || token.isEmpty()) {
            throw new BadRequestException("Empty token.");
        }

        String email = jwtService.extractUsername(token);
        UserModel user = userRepository.findByEmail(email).orElseThrow(()-> new UsernameNotFoundException("Email not found"));

        boolean isValid = jwtService.isTokenValid(token, user);
        if (!isValid) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token");
        }
    }

    public String[] getRoles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {
            List<String> roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            return roles.toArray(new String[0]);
        } else {
            return new String[0];
        }
    }
}
