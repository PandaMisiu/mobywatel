package com.pk.mobywatel.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/official")
@RequiredArgsConstructor
@Secured("OFFICIAL")
public class OfficialController {
}
