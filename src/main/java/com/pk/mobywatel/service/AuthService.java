package com.pk.mobywatel.service;

import com.pk.mobywatel.body.LoginBody;
import com.pk.mobywatel.body.RegisterBody;
import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.UserModelRepository;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.util.Role;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    UserModelRepository userModelRepository;
    CitizenRepository citizenRepository;
    BCryptPasswordEncoder passwordEncoder;

    @Transactional
    public void register(RegisterBody body){
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

        userModelRepository.save(user);
        citizenRepository.save(citizen);
    }

    public void login(LoginBody body){

    }
}
