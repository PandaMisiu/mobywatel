package com.pk.mobywatel.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class DeleteOfficialTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    private ValidationRequest token;

    @BeforeAll
    void setUp() throws Exception {
        OfficialBody validBody = new OfficialBody(
                1,
                "test@email.com",
                "Test123!",
                "Test",
                "Testowy",
                "Manager"
        );

        LoginBody validLogin = new LoginBody("admin@test.com", "Admin123!");

        String requestBody = mapper.writeValueAsString(validLogin);

        MvcResult result = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn();

        token = new ValidationRequest(result.getResponse().getCookie("jwt").getValue());

        requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(post("/api/admin/official")
                .cookie(new Cookie("jwt", token.token()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody));
    }

    @Test
    void validDeleteOfficialTest() throws Exception {
        mvc.perform(delete("/api/admin/official")
                        .param("officialID", "1")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.successful").value(true))
                .andExpect(jsonPath("$.message").value("Official account deleted"));
    }

    @Test
    void blankParamDeleteOfficialTest() throws Exception {
        mvc.perform(delete("/api/admin/official")
                        .param("officialID", "")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void invalidParamDeleteOfficialTest() throws Exception {
        mvc.perform(delete("/api/admin/official")
                        .param("officialID", "test")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void nonExistParamDeleteOfficialTest() throws Exception {
        mvc.perform(delete("/api/admin/official")
                        .param("officialID", "2")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }
}
