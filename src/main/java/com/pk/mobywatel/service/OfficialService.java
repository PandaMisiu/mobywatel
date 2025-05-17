package com.pk.mobywatel.service;

import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.request.CitizenBody;
import com.pk.mobywatel.response.CitizenDto;
import com.pk.mobywatel.util.Gender;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.unak7.peselvalidator.GenderEnum;
import pl.unak7.peselvalidator.PeselValidator;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfficialService {

    private final CitizenRepository citizenRepository;
    private final DataValidator validator;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final PeselValidator peselValidator;

    @Transactional
    public void updateCitizenAccount(CitizenBody body) throws BadRequestException {

        if(body.citizenID() == null) throw new BadRequestException("Citizen ID is required");

        Citizen citizen = citizenRepository.findById(body.citizenID()).orElseThrow(() -> new BadRequestException("Citizen not found"));
        UserModel user = citizen.getUser();

        // Jeśli pole jest null lub składa sie z białych znaków to jest pomijane (nie wyrzuca błędu)
        if(validator.validateUpdateField(body.email())){
            if(validator.checkEmailRegex(body.email())){
                if(!body.email().equals(user.getEmail()) && validator.checkIfEmailIsTaken(body.email())) throw new BadRequestException("Email is taken");
                user.setEmail(body.email());
            }
            else throw new BadRequestException("Invalid email");
        }

        if(validator.validateUpdateField(body.password())){
            if(validator.checkPasswordRegex(body.password())) user.setPassword(passwordEncoder.encode(body.password()));
            else throw new BadRequestException("Invalid password");
        }

        if(validator.validateUpdateField(body.firstName())) citizen.setFirstName(body.firstName());

        if(validator.validateUpdateField(body.lastName())) citizen.setLastName(body.lastName());

        // Przy aktualizacji sprawdzane jest czy data urodzenia, pesel i płeć są ze sobą zgodne
        GenderEnum peselGender;
        Gender updateGender;
        String updatePESEL;
        LocalDate updateBirthDate;

        if(validator.validateUpdateField(body.gender())) updateGender = body.gender();
        else updateGender = citizen.getGender();

        if(updateGender == Gender.MALE) peselGender = GenderEnum.MALE;
        else peselGender = GenderEnum.FEMALE;

        if(validator.validateUpdateField(body.birthDate())){
            if (body.birthDate().isAfter(LocalDate.now())) {
                throw new BadRequestException("Birth date is after current date.");
            }
            updateBirthDate = body.birthDate();
        }
        else updateBirthDate = LocalDate.now();

        if(validator.validateUpdateField(body.PESEL())) updatePESEL = body.PESEL();
        else updatePESEL = citizen.getPESEL();

        if(!body.PESEL().equals(citizen.getPESEL()) && validator.checkIfPESELIsTaken(body.PESEL())) throw new BadRequestException("PESEL is taken.");

        if (!peselValidator.validate(updatePESEL, updateBirthDate, peselGender)) throw new BadRequestException("The birth date and gender must match the PESEL.");

        citizen.setPESEL(updatePESEL);
        citizen.setBirthDate(updateBirthDate);
        citizen.setGender(updateGender);

        userRepository.save(user);
        citizenRepository.save(citizen);
    }

    public List<CitizenDto> fetchCitizens(){
        List<CitizenDto> citizens = citizenRepository.findAll()
                .stream()
                .map(citizen -> new CitizenDto(
                        citizen.getCitizenID(),
                        citizen.getFirstName(),
                        citizen.getLastName(),
                        citizen.getBirthDate(),
                        citizen.getPESEL(),
                        citizen.getGender(),
                        citizen.getUser().getEmail()
                ))
                .toList();

        return citizens;
    }

    @Transactional
    public void deleteCitizenAccount(Integer citizenID) throws BadRequestException {
        Citizen citizen = citizenRepository.findById(citizenID).orElseThrow(() ->new BadRequestException("Citizen not found"));
        citizenRepository.delete(citizen);
    }

    public CitizenDto fetchCitizenAccount(Integer officialID) throws BadRequestException {
        Citizen citizen = citizenRepository.findById(officialID).orElseThrow(() ->new BadRequestException("Citizen not found"));

        return new CitizenDto(citizen.getCitizenID(),
                              citizen.getFirstName(),
                              citizen.getLastName(),
                              citizen.getBirthDate(),
                              citizen.getPESEL(),
                              citizen.getGender(),
                              citizen.getUser().getEmail());
    }

}
