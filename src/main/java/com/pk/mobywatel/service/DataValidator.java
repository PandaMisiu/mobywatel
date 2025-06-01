package com.pk.mobywatel.service;

import com.pk.mobywatel.request.DocumentIssueBody;
import com.pk.mobywatel.request.OfficialBody;
import com.pk.mobywatel.request.RegisterBody;
import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.util.Gender;
import com.pk.mobywatel.util.RequestedDocument;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import pl.unak7.peselvalidator.GenderEnum;
import pl.unak7.peselvalidator.PeselValidator;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DataValidator {
    private final PeselValidator peselValidator;
    private final UserRepository userRepository;
    private final CitizenRepository citizenRepository;

    // validator dla Usera nie zależnie czy Citizen, Official czy Admin
    public void validateUserRegisterData(String email, String password) throws BadRequestException {
        if(email == null || password == null) {
            throw new BadRequestException("A field is null.");
        }

        if(email.isBlank() || password.isBlank()) {
            throw new BadRequestException("A field is blank.");
        }

        if (!checkEmailRegex(email)) {
            throw new BadRequestException("Incorrect email.");
        }

        if(!checkPasswordRegex(password)) {
            throw new BadRequestException("Incorrect password.");
        }

        if(checkIfEmailIsTaken(email)) {
            throw new BadRequestException("Email is taken.");
        }
    }

    public void validateCitizenRegisterData(RegisterBody body) throws BadRequestException {
        String email = body.email(),
                password = body.password(),
                firstName = body.firstName(),
                lastName = body.lastName(),
                PESEL = body.PESEL();
        LocalDate birthDate = body.birthDate();
        Gender gender = body.gender();

        try{
            validateUserRegisterData(email, password);
        }catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        }

        if (firstName == null || lastName == null || PESEL == null || birthDate == null || gender == null) {
            throw new BadRequestException("A field is null.");
        }

        if (firstName.isBlank() || lastName.isBlank() || PESEL.isBlank()) {
            throw new BadRequestException("A field is blank.");
        }

        GenderEnum peselGender;
        if(gender==Gender.MALE) peselGender = GenderEnum.MALE;
        else peselGender = GenderEnum.FEMALE;

        if (!peselValidator.validate(PESEL, birthDate, peselGender)) {
            throw new BadRequestException("Invalid pesel.");
        }

        if(checkIfPESELIsTaken(PESEL)) {
            throw new BadRequestException("PESEL is taken.");
        }

        if (birthDate.isAfter(LocalDate.now())) {
            throw new BadRequestException("Birth date is after current date.");
        }
    }

    public void validateOfficialRegisterData(OfficialBody body) throws BadRequestException {
        String email = body.email(),
                password = body.password(),
                firstName = body.firstName(),
                lastName = body.lastName(),
                position = body.position();

        try{
            validateUserRegisterData(email, password);
        }catch (BadRequestException e) {
            throw new BadRequestException(e.getMessage());
        }

        if (firstName == null || lastName == null || position == null) {
            throw new BadRequestException("A field is null.");
        }

        if (firstName.isBlank() || lastName.isBlank() || position.isBlank()) {
            throw new BadRequestException("A field is blank.");
        }
    }

    public void validateCitizenDocumentIssueData(DocumentIssueBody body) throws BadRequestException {
        if (body.requestedDocument() == null ||
            (body.requestedDocument() == RequestedDocument.DRIVER_LICENSE && body.licenseCategory() == null) ||
            (body.requestedDocument() == RequestedDocument.IDENTITY_CARD && body.citizenship() == null)) {
            throw new BadRequestException("A field is null.");
        }
    }

    public boolean checkIfEmailIsTaken(String email){
        UserModel user = userRepository.findByEmail(email).orElse(null);
        return user != null;
    }

    public boolean checkIfPESELIsTaken(String PESEL){
        Citizen citizen = citizenRepository.findByPESEL(PESEL).orElse(null);
        return citizen != null;
    }

    public boolean checkEmailRegex(String email){
        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";

        if (!email.matches(emailRegex)) {
            return false;
        }

        return true;
    }

    public boolean checkPasswordRegex(String password){
        // min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
        String passwordRegex = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,40}$";

        if (!password.matches(passwordRegex)) {
            return false;
        }

        return true;
    }

    public boolean validateUpdateField(Object field) throws BadRequestException {
        if(field == null){
            return false;
        }

        return !(field instanceof String) || !((String) field).isBlank();
    }

    public void validatePESEL(String PESEL) throws BadRequestException {
        if (PESEL == null || PESEL.isEmpty()) {
            throw new BadRequestException("A field is null.");
        } else if (PESEL.length() != 11) {
            throw new BadRequestException("Pesel must be 11 characters.");
        }
    }
}
