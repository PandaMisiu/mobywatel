package com.pk.mobywatel.aspect;

import com.pk.mobywatel.model.Log;
import com.pk.mobywatel.model.UserModel;
import com.pk.mobywatel.repository.LogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;

@Aspect
@Component
public class LoggingAspect {
    @Autowired(required = false)
    private HttpServletRequest request;

    @Autowired
    private LogRepository logRepository;

    @AfterReturning(
            pointcut = "execution(* com.pk.mobywatel.controllers.*.*(..)) &&" +
                    "!execution(* com.pk.mobywatel.controllers.AuthController.validateTokenFromCookie(..)) &&" +
                    "!execution(* com.pk.mobywatel.controllers.AuthController.validateTokenFromString(..))",
            returning = "result"
    )
    public void logEndpoint(JoinPoint joinPoint, Object result) {
        Integer statusCode = 200;

        if (result instanceof ResponseEntity<?> responseEntity) {
            statusCode = responseEntity.getStatusCode().value();
        }

        UserModel user = getCurrentUser();
        Log log;

        if (user == null) {
            log = Log.builder()
                    .accessTimestamp(new Timestamp(System.currentTimeMillis()))
                    .description("Endpoint: " + request.getMethod() + " " + request.getRequestURL() + " accessed; HTTP status code: " + statusCode + "; no user!")
                    .build();
        } else {
            log = Log.builder()
                    .userModel(getCurrentUser())
                    .accessTimestamp(new Timestamp(System.currentTimeMillis()))
                    .description("Endpoint: " + request.getMethod() + " " + request.getRequestURL() + " accessed; HTTP status code: " + statusCode)
                    .build();
        }

        logRepository.save(log);
    }

    @AfterThrowing(pointcut = "execution(* com.pk.mobywatel.controllers.*.*(..))", throwing = "exception")
    public void logException(JoinPoint joinPoint, Exception exception) {
        UserModel user = getCurrentUser();
        Log log;

        if (user == null) {
            log = Log.builder()
                    .accessTimestamp(new Timestamp(System.currentTimeMillis()))
                    .description("Endpoint: " + request.getMethod() + " " + request.getRequestURL() + "; Exception: " + exception.getLocalizedMessage() + "; no user!")
                    .build();
        } else {
            log = Log.builder()
                    .userModel(getCurrentUser())
                    .accessTimestamp(new Timestamp(System.currentTimeMillis()))
                    .description("Endpoint: " + request.getMethod() + " " + request.getRequestURL() + "; Exception: " + exception.getLocalizedMessage())
                    .build();
        }

        logRepository.save(log);
    }

    private UserModel getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return (UserModel) principal;
        }

        return null;
    }
}
