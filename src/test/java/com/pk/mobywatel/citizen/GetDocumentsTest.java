package com.pk.mobywatel.citizen;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pk.mobywatel.model.*;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.DocumentRepository;
import com.pk.mobywatel.repository.OfficialRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.request.LoginBody;
import com.pk.mobywatel.request.ValidationRequest;
import com.pk.mobywatel.util.Gender;
import com.pk.mobywatel.util.Role;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class GetDocumentsTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private CitizenRepository citizenRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfficialRepository officialRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    private String token;

    @BeforeAll
    public void setUp() throws Exception {
        UserModel citizenUser = UserModel.builder()
                .email("test@gmail.com")
                .password(encoder.encode("Testpass123!"))
                .role(Role.CITIZEN)
                .build();

        UserModel officialUser = UserModel.builder()
                .email("official@test.com")
                .password(encoder.encode("Testofficial123!"))
                .role(Role.OFFICIAL)
                .build();

        Citizen citizen = Citizen.builder()
                .user(citizenUser)
                .firstName("Test")
                .lastName("Testowy")
                .birthDate(LocalDate.of(1990, 3, 15))
                .PESEL("90051512340")
                .gender(Gender.FEMALE)
                .build();

        Official official = Official.builder()
                .user(officialUser)
                .firstName("Testofficial")
                .lastName("Testowyofficial")
                .position("Manager")
                .build();

        IdentityCard identityCard = IdentityCard.builder()
                .citizen(citizen)
                .issueDate(LocalDate.of(2018, 3, 15))
                .expirationDate(LocalDate.of(2028, 3, 15))
                .issueAuthority(official)
                .lost(false)
                .citizenship("Polish")
                .build();

        transactionTemplate.execute(status -> {
            userRepository.deleteAll();
            officialRepository.deleteAll();
            citizenRepository.deleteAll();
            documentRepository.deleteAll();

            userRepository.save(citizenUser);
            userRepository.save(officialUser);
            officialRepository.save(official);
            citizenRepository.save(citizen);
            documentRepository.save(identityCard);

            return null;
        });

        LoginBody validLogin = new LoginBody("test@gmail.com", "Testpass123!");

        String requestBody = mapper.writeValueAsString(validLogin);

        MvcResult result = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn();

        token = new ValidationRequest(result.getResponse().getCookie("jwt").getValue()).token();
    }

    @AfterAll
    public void tearDown() {
        transactionTemplate.execute(status -> {
            userRepository.deleteAll();
            officialRepository.deleteAll();
            citizenRepository.deleteAll();
            documentRepository.deleteAll();

            return null;
        });
    }

    @Test
    void validGetDocumentsTest() throws Exception {
        mvc.perform(get("/api/citizen/docs")
                    .param("citizenID", "1")
                    .cookie(new Cookie("jwt", token))
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void blankParamGetDocumentsTest() throws Exception {
        mvc.perform(get("/api/citizen/docs")
                        .param("citizenID", "")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void invalidParamGetDocumentsTest() throws Exception {
        mvc.perform(get("/api/citizen/docs")
                        .param("citizenID", "test")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void nonExistParamGetDocumentsTest() throws Exception {
        mvc.perform(get("/api/citizen/docs")
                        .param("citizenID", "2")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
