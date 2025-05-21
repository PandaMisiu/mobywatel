package com.pk.mobywatel.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pk.mobywatel.repository.OfficialRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.request.LoginBody;
import com.pk.mobywatel.request.OfficialBody;
import com.pk.mobywatel.request.ValidationRequest;
import jakarta.servlet.http.Cookie;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.support.TransactionTemplate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class GetOfficialTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private OfficialRepository officialRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private TransactionTemplate transactionTemplate;

    private ValidationRequest token;

    private OfficialBody officialBody;

    @BeforeEach
    void setUp() throws Exception {
        LoginBody validBody = new LoginBody("admin@test.com", "Admin123!");

        String requestBody = mapper.writeValueAsString(validBody);

        MvcResult result = mvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
                .andReturn();

        token = new ValidationRequest(result.getResponse().getCookie("jwt").getValue());

        officialBody = new OfficialBody(
                1,
                "test@email.com",
                "Test123!",
                "Test",
                "Testowy",
                "Manager"
        );

        requestBody = mapper.writeValueAsString(officialBody);

        mvc.perform(post("/api/admin/official")
                .cookie(new Cookie("jwt", token.token()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody));
    }

    @Test
    void validOfficialIDTest() throws Exception {
        mvc.perform(get("/api/admin/official")
                    .cookie(new Cookie("jwt", token.token()))
                    .param("officialID", "1")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.officialID").value(officialBody.officialID()))
                .andExpect(jsonPath("$.firstName").value(officialBody.firstName()))
                .andExpect(jsonPath("$.lastName").value(officialBody.lastName()))
                .andExpect(jsonPath("$.position").value(officialBody.position()))
                .andExpect(jsonPath("$.email").value(officialBody.email()));
    }

    @Test
    void invalidOfficialIDTest() throws Exception {
        mvc.perform(get("/api/admin/official")
                        .cookie(new Cookie("jwt", token.token()))
                        .param("officialID", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    void blankOfficialIDTest() throws Exception {
        mvc.perform(get("/api/admin/official")
                        .cookie(new Cookie("jwt", token.token()))
                        .param("officialID", "")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }
}
