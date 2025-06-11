package com.pk.mobywatel;

import com.pk.mobywatel.service.FilesystemService;
import com.pk.mobywatel.service.UserService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;

@SpringBootApplication
public class MobywatelApplication {

    public static void main(String[] args) {
        SpringApplication.run(MobywatelApplication.class, args);

    }

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner commandLineRunner(UserService userService, FilesystemService filesystemService) throws BadRequestException {
        return runner -> {
            try{
                filesystemService.init();
                userService.getUserIDFromEmail(adminEmail);
                System.out.println("Admin account is already in database");
            }catch (RuntimeException e){
                userService.registerAdmin(adminEmail, adminPassword);
                System.out.println("Admin created");
            }
        };
    }
}
