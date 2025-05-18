package com.pk.mobywatel;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pk.mobywatel.request.LoginBody;
import com.pk.mobywatel.request.RegisterBody;
import com.pk.mobywatel.util.Gender;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class LoginIntegrationTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    private static LoginBody validBody;

    @BeforeAll
    void setUp() throws Exception {
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

        validBody = new LoginBody(
            registerBody.email(),
            registerBody.password()
        );
    }

    @Test
    public void validLoginTest() throws Exception {
        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    public void missingFieldLoginTest() throws Exception {
        String requestBody = mapper.writeValueAsString(validBody);

        ObjectNode jsonNode = (ObjectNode) mapper.readTree(requestBody);
        jsonNode.remove("email");

        requestBody = mapper.writeValueAsString(jsonNode);

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void blankFieldLoginTest() throws Exception {
        LoginBody invalidBody = new LoginBody(
                "",
                validBody.password()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void incorrectPasswordLoginTest() throws Exception {
        LoginBody invalidBody = new LoginBody(
            validBody.email(),
            "Test123"
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void emailNotExistingLoginTest() throws Exception {
        LoginBody invalidBody = new LoginBody(
                "nietest@email.com",
                validBody.password()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isNotFound());
    }
}
