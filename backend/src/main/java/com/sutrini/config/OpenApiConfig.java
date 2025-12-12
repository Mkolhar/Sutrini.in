package com.sutrini.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Sutrini Studio API", version = "1.0.0", description = "Comprehensive API documentation for Sutrini Studio - A custom textile e-commerce platform. "
                +
                "This API supports both consumer-facing and admin portal operations.", contact = @Contact(name = "Sutrini Studio Support", email = "support@sutrini.com"), license = @License(name = "Proprietary", url = "https://sutrini.com/license")), servers = {
                                @Server(description = "Local Development Server", url = "http://localhost:8081"),
                                @Server(description = "Production Server", url = "https://api.sutrini.com")
                })
@SecurityScheme(name = "Bearer Authentication", description = "JWT Bearer token authentication. Obtain token from /api/auth/signin endpoint and include it in the Authorization header as 'Bearer {token}'", scheme = "bearer", type = SecuritySchemeType.HTTP, bearerFormat = "JWT", in = SecuritySchemeIn.HEADER)
public class OpenApiConfig {
}
