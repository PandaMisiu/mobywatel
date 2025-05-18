package com.pk.mobywatel.login;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.request.RegisterBody;
import com.pk.mobywatel.util.Gender;
import jakarta.transaction.Transactional;
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
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class RegisterIntegrationTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private CitizenRepository citizenRepository;

    private RegisterBody validBody;

    @BeforeEach
    public void setUp() throws Exception {
        validBody = new RegisterBody(
            "test@gmail.pl",
            "Testpass123!",
            "Test",
            "Testowy",
            LocalDate.of(1990, 3, 15),
            "90031512348",
            Gender.FEMALE
        );
    }

    @Test
    public void validRegisterTest() throws Exception {
        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.successful").value(true))
                .andExpect(jsonPath("$.message").value("Register successful"));
    }

    @Test
    public void missingFieldRegisterTest() throws Exception {
        String requestBody = mapper.writeValueAsString(validBody);

        ObjectNode jsonNode = (ObjectNode) mapper.readTree(requestBody);
        jsonNode.remove("gender");

        String modifiedRequestBody = mapper.writeValueAsString(jsonNode);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(modifiedRequestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void blankFieldRegisterTest() throws Exception {
        RegisterBody invalidBody = new RegisterBody(
                validBody.email(),
                validBody.password(),
                "",
                validBody.lastName(),
                validBody.birthDate(),
                validBody.PESEL(),
                validBody.gender()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void invalidEmailRegisterTest() throws Exception {
        RegisterBody invalidBody = new RegisterBody(
                "test.gmail.com",
                validBody.password(),
                validBody.firstName(),
                validBody.lastName(),
                validBody.birthDate(),
                validBody.PESEL(),
                validBody.gender()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void invalidPasswordRegisterTest() throws Exception {
        RegisterBody invalidBody = new RegisterBody(
                validBody.email(),
                "test123",
                validBody.firstName(),
                validBody.lastName(),
                validBody.birthDate(),
                validBody.PESEL(),
                validBody.gender()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void invalidGenderRegisterTest() throws Exception {
        RegisterBody invalidBody = new RegisterBody(
                validBody.email(),
                validBody.password(),
                validBody.firstName(),
                validBody.lastName(),
                validBody.birthDate(),
                validBody.PESEL(),
                Gender.MALE
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void invalidBirthdatePESELRegisterTest() throws Exception {
        RegisterBody invalidBody = new RegisterBody(
                validBody.email(),
                validBody.password(),
                validBody.firstName(),
                validBody.lastName(),
                LocalDate.of(1996, 6, 16),
                validBody.PESEL(),
                validBody.gender()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void invalidBirthdateNOWRegisterTest() throws Exception {
        RegisterBody invalidBody = new RegisterBody(
                validBody.email(),
                validBody.password(),
                validBody.firstName(),
                validBody.lastName(),
                LocalDate.of(2030, 6, 16),
                validBody.PESEL(),
                validBody.gender()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }


    @Test
    public void existingEmailRegisterTest() throws Exception {
        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody));

        RegisterBody invalidBody = new RegisterBody(
                validBody.email(),
                validBody.password(),
                "Nietest",
                "Nietestnazwiska",
                LocalDate.of(1995, 5, 15),
                "90051512340",
                Gender.MALE
        );

        requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void existingPESELRegisterTest() throws Exception {
        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody));

        RegisterBody invalidBody = new RegisterBody(
                "nietest@email.com",
                validBody.password(),
                "Nietest",
                "Nietestnazwiska",
                LocalDate.of(1990, 5, 15),
                "90051512340",
                Gender.FEMALE
        );

        requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }
}
