package com.sutrini.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
@Schema(description = "Login request containing user credentials")
public class LoginRequest {
    @NotBlank
    @Schema(description = "User email address", example = "user@example.com")
    private String email;

    @NotBlank
    @Schema(description = "User password", example = "password123")
    private String password;
}
