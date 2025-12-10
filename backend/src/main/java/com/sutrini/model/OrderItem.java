package com.sutrini.model;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Schema(description = "Order item representing a single product in an order")
public class OrderItem {
    @Schema(description = "Product ID", example = "prod123")
    private String productId;

    @Schema(description = "Product name at time of order", example = "Custom Silk Saree")
    private String productName;

    @Schema(description = "Quantity ordered", example = "2")
    private int quantity;

    @Schema(description = "Unit price at time of order", example = "5000.00")
    private BigDecimal unitPrice;

    @Schema(description = "Selected size", example = "M")
    private String size;

    @Schema(description = "Selected color", example = "Red")
    private String color;

    @Schema(description = "Custom notes or instructions for this item", example = "Please add extra embroidery")
    private String customNotes;
}
