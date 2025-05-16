package com.pk.mobywatel.service;

import com.pk.mobywatel.request.RegisterBody;
import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.util.Gender;
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

    public void validateRegisterData(RegisterBody body) throws BadRequestException {
        String email = body.email(),
                password = body.password(),
                firstName = body.firstName(),
                lastName = body.lastName(),
                PESEL = body.PESEL();
        LocalDate birthDate = body.birthDate();
        Gender gender = body.gender();

        if (email == null || password == null || firstName == null || lastName == null || PESEL == null || birthDate == null || gender == null) {
            throw new BadRequestException("A field is null.");
        }

        if (email.isBlank() || password.isBlank() || firstName.isBlank() || lastName.isBlank() || PESEL.isBlank()) {
            throw new BadRequestException("A field is blank.");
        }

        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";

        if (!email.matches(emailRegex)) {
            throw new BadRequestException("Incorrect email.");
        }

        // min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
        String passwordRegex = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,40}$";

        if (!password.matches(passwordRegex)) {
            throw new BadRequestException("Incorrect password.");
        }

        GenderEnum peselGender;
        if(gender==Gender.MALE) peselGender = GenderEnum.MALE;
        else peselGender = GenderEnum.FEMALE;

        if (!peselValidator.validate(PESEL, birthDate, peselGender)) {
            throw new BadRequestException("Invalid pesel.");
        }
        if(checkIfEmailIsTaken(email)) {
            throw new BadRequestException("Email is taken.");
        }
        if(checkIfPESELIsTaken(PESEL)) {
            throw new BadRequestException("PESEL is taken.");
        }

        if (birthDate.isAfter(LocalDate.now())) {
            throw new BadRequestException("Birth date is after current date.");
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

}
