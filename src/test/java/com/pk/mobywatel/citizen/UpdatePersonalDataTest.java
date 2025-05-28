package com.pk.mobywatel.citizen;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.request.CitizenBody;
import com.pk.mobywatel.request.LoginBody;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class UpdatePersonalDataTest {
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
    private BCryptPasswordEncoder encoder;

    private CitizenBody validBody;

    private String token;

    @BeforeAll
    public void setUp() throws Exception {
        UserModel citizenUser = UserModel.builder()
                .email("test@gmail.com")
                .password(encoder.encode("Testpass123!"))
                .role(Role.CITIZEN)
                .build();

        Citizen citizen = Citizen.builder()
                .user(citizenUser)
                .firstName("Test")
                .lastName("Testowy")
                .birthDate(LocalDate.of(1990, 3, 15))
                .PESEL("90051512340")
                .gender(Gender.FEMALE)
                .build();

        transactionTemplate.execute(status -> {
            userRepository.deleteAll();
            citizenRepository.deleteAll();

            userRepository.save(citizenUser);
            citizenRepository.save(citizen);

            return null;
        });

        LoginBody validLogin = new LoginBody("test@gmail.com", "Testpass123!");

        String requestBody = mapper.writeValueAsString(validLogin);

        MvcResult result = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn();

        token = new ValidationRequest(result.getResponse().getCookie("jwt").getValue()).token();

        validBody = new CitizenBody(
                1,
                "test@test.com",
                "Testpass123!",
                "Testik",
                "Testowy",
                LocalDate.of(1990, 5, 15),
                "90051512340",
                Gender.FEMALE
        );
    }

    @AfterAll
    public void tearDown() {
        transactionTemplate.execute(status -> {
            userRepository.deleteAll();
            citizenRepository.deleteAll();

            return null;
        });
    }

    @Test
    void validUpdatePersonalDataTest() throws Exception {
        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(post("/api/citizen/update")
                        .cookie(new Cookie("jwt", token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

//    @Test
//    public void missingFieldPersonalDataTest() throws Exception {
//        String requestBody = mapper.writeValueAsString(validBody);
//
//        ObjectNode jsonNode = (ObjectNode) mapper.readTree(requestBody);
//        jsonNode.remove("gender");
//
//        String modifiedRequestBody = mapper.writeValueAsString(jsonNode);
//
//        mvc.perform(post("/api/citizen/update")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(modifiedRequestBody))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    public void blankFieldPersonalDataTest() throws Exception {
//        CitizenBody invalidBody = new CitizenBody(
//                validBody.citizenID(),
//                validBody.email(),
//                validBody.password(),
//                "",
//                validBody.lastName(),
//                validBody.birthDate(),
//                validBody.PESEL(),
//                validBody.gender()
//        );
//
//        String requestBody = mapper.writeValueAsString(invalidBody);
//
//        mvc.perform(post("/api/citizen/update")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestBody))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    public void invalidEmailPersonalDataTest() throws Exception {
//        CitizenBody invalidBody = new CitizenBody(
//                validBody.citizenID(),
//                "test.gmail.com",
//                validBody.password(),
//                validBody.firstName(),
//                validBody.lastName(),
//                validBody.birthDate(),
//                validBody.PESEL(),
//                validBody.gender()
//        );
//
//        String requestBody = mapper.writeValueAsString(invalidBody);
//
//        mvc.perform(post("/api/citizen/update")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestBody))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    public void invalidPasswordPersonalDataTest() throws Exception {
//        CitizenBody invalidBody = new CitizenBody(
//                validBody.citizenID(),
//                validBody.email(),
//                "test123",
//                validBody.firstName(),
//                validBody.lastName(),
//                validBody.birthDate(),
//                validBody.PESEL(),
//                validBody.gender()
//        );
//
//        String requestBody = mapper.writeValueAsString(invalidBody);
//
//        mvc.perform(post("/api/citizen/update")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestBody))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    public void invalidGenderPersonalDataTest() throws Exception {
//        CitizenBody invalidBody = new CitizenBody(
//                validBody.citizenID(),
//                validBody.email(),
//                validBody.password(),
//                validBody.firstName(),
//                validBody.lastName(),
//                validBody.birthDate(),
//                validBody.PESEL(),
//                Gender.MALE
//        );
//
//        String requestBody = mapper.writeValueAsString(invalidBody);
//
//        mvc.perform(post("/api/citizen/update")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestBody))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    public void invalidBirthdatePESELPersonalDataTest() throws Exception {
//        CitizenBody invalidBody = new CitizenBody(
//                validBody.citizenID(),
//                validBody.email(),
//                validBody.password(),
//                validBody.firstName(),
//                validBody.lastName(),
//                LocalDate.of(1996, 6, 16),
//                validBody.PESEL(),
//                validBody.gender()
//        );
//
//        String requestBody = mapper.writeValueAsString(invalidBody);
//
//        mvc.perform(post("/api/citizen/update")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestBody))
//                .andExpect(status().isBadRequest());
//    }
//
//    @Test
//    public void invalidBirthdateNOWPersonalDataTest() throws Exception {
//        CitizenBody invalidBody = new CitizenBody(
//                validBody.citizenID(),
//                validBody.email(),
//                validBody.password(),
//                validBody.firstName(),
//                validBody.lastName(),
//                LocalDate.of(2030, 6, 16),
//                validBody.PESEL(),
//                validBody.gender()
//        );
//
//        String requestBody = mapper.writeValueAsString(invalidBody);
//
//        mvc.perform(post("/api/citizen/update")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(requestBody))
//                .andExpect(status().isBadRequest());
//    }
}
