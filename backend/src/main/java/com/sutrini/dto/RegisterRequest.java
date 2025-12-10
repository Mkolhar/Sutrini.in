package com.sutrini.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

@Data
@Schema(description = "User registration request")
public class RegisterRequest {
    @NotBlank
    @Schema(description = "User first name", example = "John")
    private String firstName;

    @NotBlank
    @Schema(description = "User last name", example = "Doe")
    private String lastName;

    @NotBlank
    @Email
    @Schema(description = "User email address", example = "john.doe@example.com")
    private String email;

    @NotBlank
    @Schema(description = "User password", example = "securePassword123")
    private String password;

    @Schema(description = "User roles (optional, defaults to CUSTOMER)", example = "[\"customer\"]")
    private Set<String> roles;
}
