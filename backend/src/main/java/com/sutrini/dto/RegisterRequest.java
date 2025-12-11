package com.sutrini.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Set;

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

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}
