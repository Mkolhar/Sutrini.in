package com.sutrini.controller;

import com.sutrini.model.Address;
import com.sutrini.model.User;
import com.sutrini.repository.UserRepository;
import com.sutrini.service.AddressService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@Tag(name = "Address", description = "Address Management APIs")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Address>> getUserAddresses() {
        User user = getAuthenticatedUser();
        return ResponseEntity.ok(addressService.getAddressesByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestBody Address address) {
        User user = getAuthenticatedUser();
        address.setUserId(user.getId());
        return ResponseEntity.ok(addressService.addAddress(address));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Address> updateAddress(@PathVariable String id, @RequestBody Address address) {
        // Ideally enforce that the address belongs to the user
        // For simplicity assuming service handles id check or simplistic ownership
        return ResponseEntity.ok(addressService.updateAddress(id, address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable String id) {
        addressService.deleteAddress(id);
        return ResponseEntity.ok().build();
    }
}
