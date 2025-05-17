package com.pk.mobywatel.service;

import com.pk.mobywatel.response.OfficialDto;
import com.pk.mobywatel.model.Official;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.OfficialRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.request.OfficialBody;
import com.pk.mobywatel.util.Role;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final OfficialRepository officialRepository;
    private final DataValidator validator;
    private final BCryptPasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public List<OfficialDto> fetchOfficialsData(){
        List<Official> officials = officialRepository.findAll();
        return officials.stream()
                .map(official ->{
                    String email = null;
                    if(official.getUser() != null) {
                        email = official.getUser().getEmail();
                    }
                    return new OfficialDto(
                          official.getOfficialID(),
                          official.getFirstName(),
                          official.getLastName(),
                          official.getPosition(),
                         email
                );}
                )
                .toList();
    }

    @Transactional
    public void createOfficialAccount(OfficialBody body) throws BadRequestException {
        try {
            validator.validateOfficialRegisterData(body);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

        UserModel user = UserModel.builder()
                .email(body.email())
                .password(passwordEncoder.encode(body.password()))
                .role(Role.OFFICIAL)
                .build();

        Official official = Official.builder()
                .firstName(body.firstName())
                .lastName(body.lastName())
                .position(body.position())
                .user(user)
                .build();

        userRepository.save(user);
        officialRepository.save(official);
    }

    @Transactional
    public void updateOfficialAccount(OfficialBody body) throws BadRequestException {

        if(body.officialID() == null) throw new BadRequestException("Official ID is required");

        String email = body.email(),
                password = body.password(),
                firstName = body.firstName(),
                lastName = body.lastName(),
                position = body.position();

        Official official = officialRepository.findById(body.officialID()).orElseThrow(() -> new BadRequestException("Official not found"));
        UserModel user = official.getUser();

        // Jeśli pole jest null lub składa sie z białych znaków to jest pomijane (nie wyrzuca błędu)
        if(validator.validateUpdateField(email)){
            if(validator.checkEmailRegex(email)){
                if(!email.equals(user.getEmail()) && validator.checkIfEmailIsTaken(email)) throw new BadRequestException("Email is taken");
                user.setEmail(email);
            }
            else throw new BadRequestException("Invalid email");
        }

        if(validator.validateUpdateField(password)){
            if(validator.checkPasswordRegex(password)) user.setPassword(passwordEncoder.encode(password));
            else throw new BadRequestException("Invalid password");

        }

        if(validator.validateUpdateField(firstName)) official.setFirstName(firstName);
        if(validator.validateUpdateField(lastName)) official.setLastName(lastName);
        if(validator.validateUpdateField(position)) official.setPosition(position);

        userRepository.save(user);
        officialRepository.save(official);
    }

    @Transactional
    public void deleteOfficialAccount(Integer officialID) throws BadRequestException {
        Official official = officialRepository.findById(officialID).orElseThrow(() ->new BadRequestException("Official not found"));
        officialRepository.delete(official);
    }

    public OfficialDto fetchOfficialAccount(Integer officialID) throws BadRequestException {
        Official official = officialRepository.findById(officialID).orElseThrow(() ->new BadRequestException("Official not found"));
        
        return new OfficialDto(official.getOfficialID(), official.getFirstName(), official.getLastName(), official.getPosition(), official.getUser().getEmail());
    }

}
