package com.pk.mobywatel.body;

import com.pk.mobywatel.util.Gender;

import java.time.LocalDate;

public record RegisterBody(String email,
                           String password,
                           String firstName,
                           String lastName,
                           LocalDate birthDate,
                           String PESEL,
                           Gender gender) {
}
