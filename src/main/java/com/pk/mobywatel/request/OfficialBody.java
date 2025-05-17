package com.pk.mobywatel.request;

public record OfficialBody(Integer officialID,
                           String email,
                           String password,
                           String firstName,
                           String lastName,
                           String position){}
