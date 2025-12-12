package com.sutrini.controller;

import com.sutrini.model.Order;
import com.sutrini.model.OrderStatus;
import com.sutrini.model.User;
import com.sutrini.repository.OrderRepository;
import com.sutrini.repository.UserRepository;
import com.sutrini.service.QRCodeService;
import com.sutrini.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order management APIs - Consumer endpoints (place/track orders) and Admin endpoints (manage all orders)")
public class OrderController {

    @Autowired
    OrderRepository orderRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    QRCodeService qrCodeService;

    @Autowired
    JwtUtil jwtUtils;

    @Operation(summary = "Get User Orders (Consumer)", description = "Retrieve all orders for the authenticated user. Returns a list of orders placed by the logged-in customer.", security = @SecurityRequirement(name = "Bearer Authentication"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved user orders", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping
    public List<Order> getUserOrders() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return orderRepository.findByCustomerId(user.getId());
    }

    @Operation(summary = "Get Order by ID (Consumer)", description = "Retrieve detailed information about a specific order by its ID. Customers can view their own order details.", security = @SecurityRequirement(name = "Bearer Authentication"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
            @ApiResponse(responseCode = "404", description = "Order not found"),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrder(
            @Parameter(description = "Order ID", required = true) @PathVariable String id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get All Orders (Admin)", description = "Retrieve all orders in the system. Requires ADMIN role. Used by administrators to monitor and manage all customer orders.", security = @SecurityRequirement(name = "Bearer Authentication"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all orders", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
            @ApiResponse(responseCode = "403", description = "Not authorized - Admin role required")
    })
    @GetMapping("/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Operation(summary = "Update Order Status (Admin/Worker)", description = "Update the status of an order (e.g., PENDING, IN_PROGRESS, COMPLETED, CANCELLED). Requires ADMIN or WORKER role. Used by staff to track order fulfillment.", security = @SecurityRequirement(name = "Bearer Authentication"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order status updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class))),
            @ApiResponse(responseCode = "404", description = "Order not found"),
            @ApiResponse(responseCode = "403", description = "Not authorized - Admin or Worker role required")
    })
    @PutMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN') or hasRole('WORKER')")
    public ResponseEntity<?> updateOrderStatus(
            @Parameter(description = "Order ID", required = true) @PathVariable String id,
            @RequestBody OrderStatus status) {
        return orderRepository.findById(id)
                .map(order -> {
                    order.setStatus(status);
                    // In real app, send notifications here
                    return ResponseEntity.ok(orderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Create Order (Consumer)", description = "Place a new order with product items. Automatically associates the order with the authenticated user and generates a QR code for order tracking. The order is initially set to PENDING status.", security = @SecurityRequirement(name = "Bearer Authentication"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Order created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Order.class), examples = @ExampleObject(name = "Created Order", value = "{\"id\": \"order123\", \"customerId\": \"user123\", \"customerEmail\": \"user@example.com\", \"items\": [{\"productId\": \"prod123\", \"quantity\": 2, \"unitPrice\": 5000}], \"totalAmount\": 10000, \"status\": \"PENDING\", \"qrCodeUrl\": \"data:image/png;base64,...\"}"))),
            @ApiResponse(responseCode = "401", description = "Not authenticated")
    })
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        order.setCustomerId(user.getId());
        order.setCustomerEmail(user.getEmail());
        order.setTenantId(user.getTenantId()); // Set Tenant ID
        order.setStatus(OrderStatus.PENDING); // Or PAID if payment flow is upstream

        Order savedOrder = orderRepository.save(order);

        try {
            // Generate QR Code containing Order ID or URL
            String qrContent = "ORDER:" + savedOrder.getId();
            String qrBase64 = qrCodeService.generateQRCodeImage(qrContent, 200, 200);
            savedOrder.setQrCodeUrl("data:image/png;base64," + qrBase64);
            orderRepository.save(savedOrder);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ResponseEntity.ok(savedOrder);
    }
}
