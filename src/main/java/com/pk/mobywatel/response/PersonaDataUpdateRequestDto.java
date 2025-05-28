package com.pk.mobywatel.response;

import com.pk.mobywatel.util.Gender;

import java.time.LocalDate;

public record PersonaDataUpdateRequestDto(Integer requestID,
                                          Integer citizenID,
                                          String requestedFirstName,
                                          String requestedLastName,
                                          LocalDate requestedBirthDate,
                                          Gender requestedGender,
                                          Boolean approved,
                                          Boolean processed,
                                          LocalDate requestDate) {}
