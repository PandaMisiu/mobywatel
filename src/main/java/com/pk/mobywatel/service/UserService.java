package com.pk.mobywatel.service;

import com.pk.mobywatel.request.RegisterBody;
import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.util.Role;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final CitizenRepository citizenRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final DataValidator validator;

    @Transactional
    public void register(RegisterBody body) throws BadRequestException {
        try {
            validator.validateCitizenRegisterData(body);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }

        UserModel user = UserModel.builder()
                .email(body.email())
                .password(passwordEncoder.encode(body.password()))
                .role(Role.CITIZEN)
                .build();

        Citizen citizen = Citizen.builder()
                .firstName(body.firstName())
                .lastName(body.lastName())
                .PESEL(body.PESEL())
                .user(user)
                .birthDate(body.birthDate())
                .gender(body.gender())
                .build();

        userRepository.save(user);
        citizenRepository.save(citizen);
    }

    @Transactional
    public void registerAdmin(String email, String password) throws BadRequestException {
        try{
            validator.validateUserRegisterData(email, password);
        }catch (BadRequestException e){
            throw new BadRequestException(e.getMessage());
        }
        UserModel admin = UserModel.builder()
                        .email(email)
                        .password(passwordEncoder.encode(password))
                        .role(Role.ADMIN)
                        .build();

        userRepository.save(admin);
    }


    public Integer getUserIDFromEmail(String email){
        UserModel user = userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("No user with this username"));
        return user.getUserID();
    }

    public String[] getUserRolesFromEmail(String email) {
        UserModel user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("No user with this email"));
        return new String[]{"ROLE_" + user.getRole().name()};
    }
}
