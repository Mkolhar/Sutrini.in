package com.sutrini.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Document(collection = "products")
@Schema(description = "Product entity representing items available in the catalog")
public class Product {
    @Id
    @Schema(description = "Unique product identifier", example = "prod123")
    private String id;

    @Schema(description = "Product name", example = "Custom Silk Saree")
    private String name;

    @Schema(description = "Detailed product description", example = "Premium quality silk saree with traditional design")
    private String description;

    @Schema(description = "Product category", example = "sarees", allowableValues = { "sarees", "blouses", "fabrics",
            "accessories" })
    private String category;

    // Store image URLs
    @Schema(description = "List of product image URLs", example = "[\"https://example.com/img1.jpg\", \"https://example.com/img2.jpg\"]")
    private List<String> images;

    @Schema(description = "Base price of the product", example = "5000.00")
    private BigDecimal basePrice;

    // e.g. "S", "M", "L", "XL"
    @Schema(description = "Available sizes for the product", example = "[\"S\", \"M\", \"L\", \"XL\"]")
    private List<String> availableSizes;

    // e.g. "Red", "Blue", "Black"
    @Schema(description = "Available colors for the product", example = "[\"Red\", \"Blue\", \"Black\"]")
    private List<String> availableColors;

    // Simple stock management for now
    @Schema(description = "Current stock quantity", example = "50")
    private Integer stockQuantity;

    @Schema(description = "Whether the product is active and available for purchase", example = "true", defaultValue = "true")
    private boolean active = true;
}
