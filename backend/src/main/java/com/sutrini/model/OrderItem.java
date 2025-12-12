package com.sutrini.model;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

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

    @Schema(description = "URL or Base64 string of the custom design image", example = "data:image/png;base64,...")
    private String designImageUrl;

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getCustomNotes() {
        return customNotes;
    }

    public void setCustomNotes(String customNotes) {
        this.customNotes = customNotes;
    }

    public String getDesignImageUrl() {
        return designImageUrl;
    }

    public void setDesignImageUrl(String designImageUrl) {
        this.designImageUrl = designImageUrl;
    }
}
