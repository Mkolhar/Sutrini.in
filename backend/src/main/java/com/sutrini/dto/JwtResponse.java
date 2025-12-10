package com.sutrini.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.List;

@Data
@Schema(description = "JWT authentication response")
public class JwtResponse {
    @Schema(description = "JWT access token", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String token;

    @Schema(description = "Token type", example = "Bearer", defaultValue = "Bearer")
    private String type = "Bearer";

    @Schema(description = "User ID", example = "user123")
    private String id;

    @Schema(description = "User email", example = "user@example.com")
    private String email;

    @Schema(description = "User roles", example = "[\"CUSTOMER\"]")
    private List<String> roles;

    public JwtResponse(String accessToken, String id, String email, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.roles = roles;
    }
}
