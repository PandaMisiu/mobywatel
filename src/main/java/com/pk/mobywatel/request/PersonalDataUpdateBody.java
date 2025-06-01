package com.pk.mobywatel.request;

import com.pk.mobywatel.util.Gender;

public record PersonalDataUpdateBody(String requestedFirstName,
                                     String requestedLastName,
                                     Gender requestedGender) {
}
