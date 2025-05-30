package com.pk.mobywatel.request;

import com.pk.mobywatel.util.Gender;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record CitizenBody(Integer citizenID,
                          String email,
                          String password,
                          String firstName,
                          String lastName,
                          LocalDate birthDate,
                          String PESEL,
                          Gender gender) {
}