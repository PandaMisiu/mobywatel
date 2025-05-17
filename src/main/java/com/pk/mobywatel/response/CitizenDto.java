package com.pk.mobywatel.response;

import com.pk.mobywatel.util.Gender;

import java.time.LocalDate;

public record CitizenDto(Integer citizenID,
                         String firstName,
                         String lastName,
                         LocalDate birthDate,
                         String PESEL,
                         Gender gender,
                         String email) {
}
