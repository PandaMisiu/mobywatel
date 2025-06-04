package com.pk.mobywatel.official;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.OfficialRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.request.CitizenBody;
import com.pk.mobywatel.request.LoginBody;
import com.pk.mobywatel.request.ValidationRequest;
import com.pk.mobywatel.util.Gender;
import com.pk.mobywatel.util.Role;
import jakarta.servlet.http.Cookie;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class CitizenDataTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private TransactionTemplate transactionTemplate;

    @Autowired
    private CitizenRepository citizenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfficialRepository officialRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    private String token;

    @BeforeAll
    public void setUp() throws Exception {
        UserModel citizenUser0 = UserModel.builder()
                .email("test0@gmail.com")
                .password(encoder.encode("Testpass123!"))
                .role(Role.CITIZEN)
                .build();

        UserModel citizenUser1 = UserModel.builder()
                .email("test1@gmail.com")
                .password(encoder.encode("Testpass123!"))
                .role(Role.CITIZEN)
                .build();

        UserModel officialUser = UserModel.builder()
                .email("official@test.com")
                .password(encoder.encode("Testofficial123!"))
                .role(Role.OFFICIAL)
                .build();

        Citizen citizen0 = Citizen.builder()
                .user(citizenUser0)
                .firstName("Test")
                .lastName("Testowy")
                .birthDate(LocalDate.of(1990, 5, 15))
                .PESEL("90051512340")
                .gender(Gender.FEMALE)
                .build();

        Citizen citizen1 = Citizen.builder()
                .user(citizenUser1)
                .firstName("Test")
                .lastName("Testowy")
                .birthDate(LocalDate.of(1990, 5, 15))
                .PESEL("90051512357")
                .gender(Gender.MALE)
                .build();

        Official official = Official.builder()
                .user(officialUser)
                .firstName("Testofficial")
                .lastName("Testowyofficial")
                .position("Manager")
                .build();

        transactionTemplate.execute(status -> {
            userRepository.deleteAll();
            officialRepository.deleteAll();
            citizenRepository.deleteAll();

            userRepository.save(citizenUser0);
            userRepository.save(citizenUser1);
            userRepository.save(officialUser);
            officialRepository.save(official);
            citizenRepository.save(citizen0);
            citizenRepository.save(citizen1);

            return null;
        });

        LoginBody validLogin = new LoginBody("official@test.com", "Testofficial123!");

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

            return null;
        });
    }

    @Test
    void validGetCitizensTest() throws Exception {
        mvc.perform(get("/api/official/citizens")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void validGetCitizenByIDorPESELTest() throws Exception {
        mvc.perform(get("/api/official/citizen")
                        .param("citizenID", "1")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        mvc.perform(get("/api/official/citizen")
                        .param("PESEL", "90051512357")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void invalidGetCitizenByPESELTest() throws Exception {
        mvc.perform(get("/api/official/citizen")
                        .param("PESEL", "90051512357")
                        .param("citizenID", "1")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void validUpdateCitizenAccount() throws Exception {
        CitizenBody validBody = new CitizenBody(
                1,
                "test0@gmail.com",
                "Testpass123!",
                "Testawa",
                "Tescik",
                LocalDate.of(1990, 5, 15),
                "90051512340",
                Gender.FEMALE
        );

        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(put("/api/official/citizen")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    void invalidUpdateCitizenAccount() throws Exception {
        CitizenBody validBody = new CitizenBody(
                null,
                "test0@gmail.com",
                "Testpass123!",
                "Testawa",
                "Tescik",
                LocalDate.of(1990, 5, 15),
                "90051512340",
                Gender.FEMALE
        );

        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(put("/api/official/citizen")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Rollback
    void validDeleteCitizen() throws Exception {
        mvc.perform(delete("/api/official/citizen")
                        .param("citizenID", "2")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void invalidDeleteCitizen() throws Exception {
        mvc.perform(delete("/api/official/citizen")
                        .param("citizenID", "3")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
