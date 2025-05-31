package com.pk.mobywatel.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI mobywatelOpenAPI() {

        return new OpenAPI()
                .info(new Info()
                        .title("mObywatel API")
                        .version("0.0.1v")
                        .description("API for managing citizens' documents. Uses JWT in a cookie named 'jwt' for authentication. For authentication and authorization select defintion" +
                                " \"public\" and login via /api/auth/login end point, cookie will be added.")
                        .license(new License().name("Apache 2.0")));
    }

    // Group for public APIs (no JWT or roles required)
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public")
                .pathsToMatch("/api/auth/**")
                .build();
    }

    // Group for official APIs (requires JWT with OFFICIAL or ADMIN role)
    @Bean
    public GroupedOpenApi officialApi() {
        return GroupedOpenApi.builder()
                .group("official")
                .pathsToMatch("/api/official/**")
                .addOperationCustomizer((operation, handlerMethod) -> {
                    operation.addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
                    if (operation.getDescription() == null) {
                        operation.setDescription("Requires ROLE_OFFICIAL or ROLE_ADMIN");
                    } else {
                        operation.setDescription(operation.getDescription() + " (Requires ROLE_OFFICIAL or ROLE_ADMIN)");
                    }
                    return operation;
                })
                .build();
    }

    // Group for admin APIs (requires JWT with ADMIN role)
    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
                .group("admin")
                .pathsToMatch("/api/admin/**")
                .addOperationCustomizer((operation, handlerMethod) -> {
                    operation.addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
                    if (operation.getDescription() == null) {
                        operation.setDescription("Requires ROLE_ADMIN");
                    } else {
                        operation.setDescription(operation.getDescription() + " (Requires ROLE_ADMIN)");
                    }
                    return operation;
                })
                .build();
    }
}