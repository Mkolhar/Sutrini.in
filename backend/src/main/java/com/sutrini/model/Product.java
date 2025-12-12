package com.sutrini.model;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.util.List;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Document(collection = "products")
@Schema(description = "Product entity representing items available in the catalog")
public class Product {
    @Id
    @Schema(description = "Unique product identifier", example = "prod123")
    private String id;

    @NotBlank(message = "Product name is required")
    @Schema(description = "Product name", example = "Custom Silk Saree")
    private String name;

    @NotBlank(message = "Description is required")
    @Schema(description = "Detailed product description", example = "Premium quality silk saree with traditional design")
    private String description;

    @NotBlank(message = "Category is required")
    @Schema(description = "Product category", example = "sarees", allowableValues = { "sarees", "blouses", "fabrics",
            "accessories" })
    private String category;

    // Store image URLs
    @Schema(description = "List of product image URLs", example = "[\"https://example.com/img1.jpg\", \"https://example.com/img2.jpg\"]")
    private List<String> images;

    @NotNull(message = "Base price is required")
    @Min(value = 0, message = "Price must be non-negative")
    @Schema(description = "Base price of the product", example = "5000.00")
    private BigDecimal basePrice;

    // e.g. "S", "M", "L", "XL"
    @Schema(description = "Available sizes for the product", example = "[\"S\", \"M\", \"L\", \"XL\"]")
    private List<String> availableSizes;

    // e.g. "Red", "Blue", "Black"
    @Schema(description = "Available colors for the product", example = "[\"Red\", \"Blue\", \"Black\"]")
    private List<String> availableColors;

    // Simple stock management for now
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be non-negative")
    @Schema(description = "Current stock quantity", example = "50")
    private Integer stockQuantity;

    @Schema(description = "Whether the product is active and available for purchase", example = "true", defaultValue = "true")
    private boolean active = true;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public List<String> getAvailableSizes() {
        return availableSizes;
    }

    public void setAvailableSizes(List<String> availableSizes) {
        this.availableSizes = availableSizes;
    }

    public List<String> getAvailableColors() {
        return availableColors;
    }

    public void setAvailableColors(List<String> availableColors) {
        this.availableColors = availableColors;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    // Multi-tenancy
    @Schema(description = "Tenant ID", example = "tenant_123")
    private String tenantId;

    public String getTenantId() {
        return tenantId;
    }

    public void setTenantId(String tenantId) {
        this.tenantId = tenantId;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
