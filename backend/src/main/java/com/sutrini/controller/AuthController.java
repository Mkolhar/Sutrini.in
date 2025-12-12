package com.sutrini.controller;

import com.sutrini.dto.JwtResponse;
import com.sutrini.dto.LoginRequest;
import com.sutrini.dto.MessageResponse;
import com.sutrini.dto.RegisterRequest;
import com.sutrini.model.Role;
import com.sutrini.model.User;
import com.sutrini.repository.UserRepository;
import com.sutrini.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication APIs for user login and registration (Consumer & Admin)")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtil jwtUtils;

    @Operation(summary = "User Sign In", description = "Authenticate user credentials and receive JWT token. Used by both consumers and admins. The returned JWT token must be included in the Authorization header (as 'Bearer {token}') for subsequent authenticated requests.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated", content = @Content(mediaType = "application/json", schema = @Schema(implementation = JwtResponse.class), examples = @ExampleObject(name = "Successful Login", value = "{\"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\", \"id\": \"123abc\", \"email\": \"user@example.com\", \"roles\": [\"CUSTOMER\"]}"))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content(mediaType = "application/json"))
    })
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal(); // Assuming UserDetailsServiceImpl
                                                                               // returns standard UserDetails
        String jwt = jwtUtils.generateToken(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        // Assuming ID is not easily accessible from standard UserDetails unless we cast
        // to custom impl or fetch.
        // For now, let's fetch user or just start with email.
        // Better: Make UserDetailsServiceImpl return a custom UserDetailsImpl that has
        // ID.
        // Quick fix: fetch by email again or use email as ID in response if acceptable,
        // but usually ID is needed.
        // Let's just lookup user by email for ID.
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(jwt,
                user.getId(),
                user.getEmail(),
                roles));
    }

    @Operation(summary = "User Registration", description = "Register a new user account. By default, users are assigned the CUSTOMER role. Admin users can assign specific roles during registration by including the 'roles' field with values: 'admin', 'worker', or 'customer'.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class), examples = @ExampleObject(name = "Successful Registration", value = "{\"message\": \"User registered successfully!\"}"))),
            @ApiResponse(responseCode = "400", description = "Email already in use", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class), examples = @ExampleObject(name = "Email Exists", value = "{\"message\": \"Error: Email is already in use!\"}")))
    })
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            roles.add(Role.CUSTOMER);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        roles.add(Role.ADMIN);
                        break;
                    case "worker":
                        roles.add(Role.WORKER);
                        break;
                    default:
                        roles.add(Role.CUSTOMER);
                }
            });
        }

        user.setRoles(roles);
        // Generate a new Tenant ID for the user (everyone gets their own tenant for now
        // in this MVP)
        // In a real app, you might join an existing tenant via Invite Code.
        user.setTenantId(java.util.UUID.randomUUID().toString());

        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
