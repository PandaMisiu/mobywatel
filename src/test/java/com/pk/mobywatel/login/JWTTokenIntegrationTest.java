package com.pk.mobywatel.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pk.mobywatel.request.LoginBody;
import com.pk.mobywatel.request.RegisterBody;
import com.pk.mobywatel.request.ValidationRequest;
import com.pk.mobywatel.util.Gender;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class JWTTokenIntegrationTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    private ValidationRequest token;

    @BeforeAll
    public void setUp() throws Exception {
        RegisterBody registerBody = new RegisterBody(
                "test@gmail.com",
                "Testpass123!",
                "Test",
                "Testowy",
                LocalDate.of(1990, 5, 15),
                "90051512340",
                Gender.FEMALE
        );

        String requestBody = mapper.writeValueAsString(registerBody);

        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody));

        LoginBody validBody = new LoginBody(
                registerBody.email(),
                registerBody.password()
        );

        requestBody = mapper.writeValueAsString(validBody);

        MvcResult result = mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andReturn();

        // get token here: token = ...
        token = new ValidationRequest(result.getResponse().getCookie("jwt").getValue());
    }

    @Test
    public void validTokenTest() throws Exception {
        String requestBody = mapper.writeValueAsString(token);

        mvc.perform(post("/api/auth/validate-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    public void invalidTokenTest() throws Exception {
        String invalidToken = "invalid-token";
        String requestBody = mapper.writeValueAsString(new ValidationRequest(invalidToken));

        mvc.perform(post("/api/auth/validate-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void emptyTokenTest() throws Exception {
        String requestBody = mapper.writeValueAsString(new ValidationRequest(""));

        mvc.perform(post("/api/auth/validate-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void nullTokenTest() throws Exception {
        String requestBody = mapper.writeValueAsString(new ValidationRequest(null));

        mvc.perform(post("/api/auth/validate-token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void validCookieTest() throws Exception {
        mvc.perform(post("/api/auth/validate-cookie")
                .cookie(new Cookie("jwt", token.token())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true))
                .andExpect(jsonPath("$.email").value("test@gmail.com"));
    }

    @Test
    public void blankCookieTest() throws Exception {
        mvc.perform(post("/api/auth/validate-cookie")
                .cookie(new Cookie("jwt", null)))
                .andExpect(status().isInternalServerError());
    }
}
