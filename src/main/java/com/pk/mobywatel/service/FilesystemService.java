package com.pk.mobywatel.service;

import com.pk.mobywatel.util.FilestorageyUtil;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
public class FilesystemService {
    private final Path docRoot = Paths.get("documents");
    private final Path requestRoot = Paths.get("document-requests");

    public void init() throws IOException {
        Files.createDirectories(docRoot);
        Files.createDirectories(requestRoot);
    }

    public void storeRequest(Integer citizenID, Integer requestID, MultipartFile file) throws BadRequestException {
        if (file.isEmpty() || !file.getContentType().startsWith("image/")) {
            throw new BadRequestException("Incorrect file");
        }

        String extension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
        Path filePath = Paths.get(requestRoot.toString(), citizenID.toString(), requestID.toString() + extension);

        try {
            Files.createDirectories(filePath.getParent());
        } catch (IOException e) {
            throw new BadRequestException();
        }

        Path destinationFile = filePath.normalize().toAbsolutePath();

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file ", e);
        }
    }

    public void moveRequestToDocs(Integer citizenID, Integer requestID, Integer docID) throws BadRequestException {
        try {
            Path rootPath = Paths.get(requestRoot.toString(), citizenID.toString());
            Path filePath = null;

            for (Path document : Files.list(rootPath).toList()) {
                if (document.getFileName().toString().startsWith(requestID.toString())) {
                    filePath = document;
                }
            }

            if (filePath == null) {
                throw new BadRequestException("File does not exist");
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable())
                throw new BadRequestException("File does not exist");

            String extension = filePath.toString().substring(filePath.toString().lastIndexOf("."));
            Path destinationFile = Paths.get(docRoot.toString(), citizenID.toString(), docID.toString() + extension);

            try {
                Files.createDirectories(destinationFile.getParent());
            } catch (IOException e) {
                throw new BadRequestException();
            }

            destinationFile = destinationFile.normalize().toAbsolutePath();

            Files.move(filePath, destinationFile, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException();
        }
    }

    public Resource loadDoc(Integer citizenID, Integer requestID, FilestorageyUtil type) throws BadRequestException {
        try {
            Path other;

            if (type == FilestorageyUtil.DOCUMENT)
                other = Paths.get(docRoot.toString(), citizenID.toString());
            else
                other = Paths.get(requestRoot.toString(), citizenID.toString());

            Path filePath = null;

            for (Path document : Files.list(other).toList()) {
                if (document.getFileName().toString().startsWith(requestID.toString())) {
                    filePath = document;
                }
            }

            if (filePath == null) {
                throw new BadRequestException("File does not exist");
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable())
                throw new BadRequestException("File does not exist");
            return resource;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
