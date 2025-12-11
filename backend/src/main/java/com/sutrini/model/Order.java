package com.sutrini.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
@Schema(description = "Order entity representing a customer's purchase order")
public class Order {
    @Id
    @Schema(description = "Unique order identifier", example = "order123")
    private String id;

    @Schema(description = "Customer user ID who placed the order", example = "user123")
    private String customerId; // User ID from User collection

    @Schema(description = "Customer email address", example = "customer@example.com")
    private String customerEmail;

    @Schema(description = "Tenant ID", example = "tenant_123")
    private String tenantId;

    @Schema(description = "List of items in the order")
    private List<OrderItem> items;

    @Schema(description = "Total order amount", example = "10000.00")
    private BigDecimal totalAmount;

    @Schema(description = "Current order status", example = "PENDING", allowableValues = { "PENDING", "IN_PROGRESS",
            "COMPLETED", "CANCELLED" })
    private OrderStatus status;

    @Schema(description = "Order creation timestamp", example = "2024-12-10T12:00:00")
    private LocalDateTime createdAt = LocalDateTime.now();

    // QR Code path/url
    @Schema(description = "Base64 encoded QR code for order tracking", example = "data:image/png;base64,iVBORw0KGgo...")
    private String qrCodeUrl;

    public Order() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }
}
