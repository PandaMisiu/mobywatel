package com.pk.mobywatel.admin;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UpdateOfficialTest {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    private ValidationRequest token;

    private OfficialBody validBody;

    @BeforeEach
    void setUp() throws Exception {
        OfficialBody officialBody = new OfficialBody(
                1,
                "test@email.com",
                "Test123!",
                "Test",
                "Testowy",
                "Manager"
        );

        LoginBody validBody = new LoginBody("admin@test.com", "Admin123!");

        String requestBody = mapper.writeValueAsString(validBody);

        MvcResult result = mvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andReturn();

        token = new ValidationRequest(result.getResponse().getCookie("jwt").getValue());

        requestBody = mapper.writeValueAsString(officialBody);

        mvc.perform(post("/api/admin/official")
                .cookie(new Cookie("jwt", token.token()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andDo(print());

        this.validBody = new OfficialBody(
                1,
                "update@email.com",
                "UpdateTest123!",
                "TestUpdate",
                "TestowyUpdate",
                "NieManager"
        );
    }

    @Test
    void validUpdateOfficialTest() throws Exception {
        String requestBody = mapper.writeValueAsString(validBody);

        mvc.perform(put("/api/admin/official")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.successful").value(true))
                .andExpect(jsonPath("$.message").value("Official account updated"));
    }

    @Test
    void missingFieldUpdateOfficialTest() throws Exception {
        String requestBody = mapper.writeValueAsString(validBody);

        ObjectNode jsonNode = (ObjectNode) mapper.readTree(requestBody);
        jsonNode.remove("firstName");

        String modifiedRequestBody = mapper.writeValueAsString(jsonNode);

        mvc.perform(put("/api/admin/official")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(modifiedRequestBody))
                .andExpect(status().isOk());
    }

    @Test
    void blankFieldUpdateOfficialTest() throws Exception {
        OfficialBody invalidBody = new OfficialBody(
                validBody.officialID(),
                validBody.email(),
                validBody.password(),
                "",
                validBody.lastName(),
                validBody.position()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(put("/api/admin/official")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk());
    }

    @Test
    void invalidEmailUpdateOfficialTest() throws Exception {
        OfficialBody invalidBody = new OfficialBody(
                validBody.officialID(),
                "test.gmail.com",
                validBody.password(),
                validBody.firstName(),
                validBody.lastName(),
                validBody.position()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(put("/api/admin/official")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void invalidPasswordUpdateOfficialTest() throws Exception {
        OfficialBody invalidBody = new OfficialBody(
                validBody.officialID(),
                validBody.email(),
                "test123",
                validBody.firstName(),
                validBody.lastName(),
                validBody.position()
        );

        String requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(put("/api/admin/official")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }

    @Test
    void existingEmailUpdateOfficialTest() throws Exception {
        OfficialBody newBody = new OfficialBody(
                2,
                validBody.email(),
                validBody.password(),
                validBody.firstName(),
                validBody.lastName(),
                validBody.position()
        );

        String requestBody = mapper.writeValueAsString(newBody);

        mvc.perform(post("/api/admin/official")
                .cookie(new Cookie("jwt", token.token()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody));

        OfficialBody invalidBody = new OfficialBody(
                validBody.officialID(),
                validBody.email(),
                validBody.password(),
                "Nietest",
                "Nietestnazwiska",
                "Manager"
        );

        requestBody = mapper.writeValueAsString(invalidBody);

        mvc.perform(put("/api/admin/official")
                        .cookie(new Cookie("jwt", token.token()))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest());
    }
}
