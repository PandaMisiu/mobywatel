package com.pk.mobywatel.controllers;

import com.pk.mobywatel.model.Citizen;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.CitizenRepository;
import com.pk.mobywatel.repository.UserRepository;
import com.pk.mobywatel.service.FilesystemService;
import com.pk.mobywatel.service.JwtService;
import com.pk.mobywatel.util.FilestorageyUtil;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/photo")
@RequiredArgsConstructor
public class FileController {
    private final CitizenRepository citizenRepository;
    private final UserRepository userRepository;
    private final FilesystemService filesystemService;
    private final JwtService jwtService;

    @Secured({"ROLE_OFFICIAL", "ROLE_ADMIN"})
    @GetMapping("/request/{documentID}")
    public ResponseEntity<Resource> requestPhoto(@PathVariable("documentID") Integer documentID, @RequestParam Integer citizenID) throws BadRequestException {
        Resource file = filesystemService.loadDoc(citizenID, documentID, FilestorageyUtil.REQUEST);

        return getResource(file);
    }

    @Secured({"ROLE_CITIZEN", "ROLE_ADMIN"})
    @GetMapping("/doc/{documentID}")
    public ResponseEntity<Resource> docPhoto(@PathVariable("documentID") Integer documentID, @CookieValue(name = "jwt") String token) throws BadRequestException {
        UserModel user = userRepository.findByEmail(jwtService.extractUsername(token))
                .orElseThrow(() -> new BadRequestException("User not found"));
        Citizen citizen = citizenRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Citizen not found"));

        Resource file = filesystemService.loadDoc(citizen.getCitizenID(), documentID, FilestorageyUtil.DOCUMENT);

        return getResource(file);
    }

    private ResponseEntity<Resource> getResource(Resource file) {
        String filename = file.getFilename();
        String contentType = "application/octet-stream";

        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            contentType = "image/jpeg";
        } else if (filename.endsWith(".png")) {
            contentType = "image/png";
        } else if (filename.endsWith(".gif")) {
            contentType = "image/gif";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(file);
    }
}
