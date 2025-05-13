package com.pk.mobywatel.service;

import com.pk.mobywatel.request.RegisterBody;
import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.util.Gender;
import lombok.RequiredArgsConstructor;
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

    public boolean validateRegisterData(RegisterBody body) {
        String email = body.email(),
                password = body.password(),
                firstName = body.firstName(),
                lastName = body.lastName(),
                PESEL = body.PESEL();
        LocalDate birthDate = body.birthDate();
        Gender gender = body.gender();

        if (email == null || password == null || firstName == null || lastName == null || PESEL == null || birthDate == null || gender == null) {
            return false;
        }

        if (email.isBlank() || password.isBlank() || firstName.isBlank() || lastName.isBlank() || PESEL.isBlank()) {
            return false;
        }

        String emailRegex = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$";

        // min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
        String passwordRegex = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,40}$";

        if (!email.matches(emailRegex) || !password.matches(passwordRegex)) {
            return false;
        }
        GenderEnum peselGender;
        if(gender==Gender.MALE) peselGender = GenderEnum.MALE;
        else peselGender = GenderEnum.FEMALE;

        if (peselValidator.validate(PESEL, birthDate, peselGender )) return false;
        if(checkIfEmailIsTaken(email)) return false;
        if(checkIfPESELIsTaken(PESEL)) return false;

        if (birthDate.isAfter(LocalDate.now())) {
            return false;
        }

        return true;
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
