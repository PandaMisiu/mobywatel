package com.pk.mobywatel.official;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.model.PersonalDataUpdateRequest;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.OfficialRepository;
import com.pk.mobywatel.repository.PersonalDataUpdateRequestRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.request.LoginBody;
import com.pk.mobywatel.request.ProcessPersonalDataUpdateBody;
import com.pk.mobywatel.request.ValidationRequest;
import com.pk.mobywatel.util.Gender;
import com.pk.mobywatel.util.Role;
import jakarta.servlet.http.Cookie;
import jakarta.transaction.Transactional;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class CitizenDataUpdateTest {
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

    @Autowired
    private PersonalDataUpdateRequestRepository personalDataUpdateRequestRepository;

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

        Citizen citizen = Citizen.builder()
                .user(citizenUser1)
                .firstName("Test")
                .lastName("Testowy")
                .birthDate(LocalDate.of(1990, 5, 15))
                .PESEL("90051512357")
                .gender(Gender.MALE)
                .build();

        PersonalDataUpdateRequest updateRequest0 = PersonalDataUpdateRequest.builder()
                .citizen(citizen)
                .requestedFirstName("Tescik")
                .requestedLastName("Testana")
                .approved(false)
                .processed(false)
                .requestDate(LocalDate.now())
                .build();

        PersonalDataUpdateRequest updateRequest1 = PersonalDataUpdateRequest.builder()
                .citizen(citizen)
                .requestedFirstName("Tescik")
                .requestedLastName("Testana")
                .approved(true)
                .processed(true)
                .requestDate(LocalDate.now())
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
            personalDataUpdateRequestRepository.deleteAll();

            userRepository.save(citizenUser0);
            userRepository.save(citizenUser1);
            userRepository.save(officialUser);
            officialRepository.save(official);
            citizenRepository.save(citizen);
            personalDataUpdateRequestRepository.save(updateRequest0);
            personalDataUpdateRequestRepository.save(updateRequest1);

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
            personalDataUpdateRequestRepository.deleteAll();
            userRepository.deleteAll();
            officialRepository.deleteAll();
            citizenRepository.deleteAll();

            return null;
        });
    }

    @Test
    void validGetRequestsTest() throws Exception {
        mvc.perform(get("/api/official/citizen/personalData/requests")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void validProcessRequestTest() throws Exception {
        ProcessPersonalDataUpdateBody validBody = new ProcessPersonalDataUpdateBody(
                1,
                true
        );

        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(post("/api/official/citizen/personalData/request")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    void processedProcessRequestTest() throws Exception {
        ProcessPersonalDataUpdateBody validBody = new ProcessPersonalDataUpdateBody(
                2,
                true
        );

        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(post("/api/official/citizen/personalData/request")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void nonexistentProcessRequestTest() throws Exception {
        ProcessPersonalDataUpdateBody validBody = new ProcessPersonalDataUpdateBody(
                3,
                true
        );

        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(post("/api/official/citizen/personalData/request")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }
}
