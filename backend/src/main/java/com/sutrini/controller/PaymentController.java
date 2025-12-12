package com.sutrini.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.sutrini.model.Order;
import com.sutrini.model.OrderStatus;
import com.sutrini.repository.OrderRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@Tag(name = "Payments", description = "Payment processing APIs using Stripe (UPI/Card)")
public class PaymentController {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Autowired
    OrderRepository orderRepository;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @PostMapping("/create-payment-intent")
    @PreAuthorize("hasRole('CUSTOMER') or hasRole('ADMIN')")
    @Operation(summary = "Create Payment Intent", description = "Initialize a Stripe PaymentIntent for an order. Returns the clientSecret needed by the frontend to confirm payment.")
    public ResponseEntity<?> createPaymentIntent(@RequestBody PaymentRequest request) throws StripeException {
        // Validate Order
        // In a real app, calculate amount from Order ID to prevent tampering
        // For now, we trust the amount or we could fetch the order:
        // Order order = orderRepository.findById(request.getOrderId()).orElseThrow();
        // long amount = order.getTotalAmount().multiply(new
        // BigDecimal(100)).longValue();

        Map<String, Object> params = new HashMap<>();
        params.put("amount", request.getAmount()); // Amount in smallest unit (e.g. paise)
        params.put("currency", "inr");
        params.put("automatic_payment_methods",
                Map.of("enabled", true)); // Enables UPI if configured in Stripe Dashboard

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        Map<String, String> responseData = new HashMap<>();
        responseData.put("clientSecret", paymentIntent.getClientSecret());
        responseData.put("id", paymentIntent.getId());

        return ResponseEntity.ok(responseData);
    }
}

class PaymentRequest {
    private String orderId;
    private Long amount; // in cents/paise

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }
}
