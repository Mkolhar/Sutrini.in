package com.sutrini.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;

@Document(collection = "design_assets")
@Schema(description = "Configuration for design studio assets (garments, mockups)")
public class DesignAsset {
    @Id
    private String id;

    @Schema(description = "Display name", example = "Classic T-Shirt")
    private String name;

    @Schema(description = "Internal type/key", example = "tshirt")
    private String type;

    @Schema(description = "URL of the mockup background image", example = "/mockup-tshirt.png")
    private String mockupImageUrl;

    @Schema(description = "Base price for this item type", example = "500.00")
    private BigDecimal basePrice;

    // CSS % values for the print area overlay
    private String printAreaTop; // e.g. "20%"
    private String printAreaLeft; // e.g. "32%"
    private String printAreaWidth; // e.g. "36%"
    private String printAreaHeight; // e.g. "40%"

    public DesignAsset() {
    }

    public DesignAsset(String name, String type, String mockupImageUrl, BigDecimal basePrice,
            String printAreaTop, String printAreaLeft, String printAreaWidth, String printAreaHeight) {
        this.name = name;
        this.type = type;
        this.mockupImageUrl = mockupImageUrl;
        this.basePrice = basePrice;
        this.printAreaTop = printAreaTop;
        this.printAreaLeft = printAreaLeft;
        this.printAreaWidth = printAreaWidth;
        this.printAreaHeight = printAreaHeight;
    }

    // Getters and Setters
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMockupImageUrl() {
        return mockupImageUrl;
    }

    public void setMockupImageUrl(String mockupImageUrl) {
        this.mockupImageUrl = mockupImageUrl;
    }

    public BigDecimal getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(BigDecimal basePrice) {
        this.basePrice = basePrice;
    }

    public String getPrintAreaTop() {
        return printAreaTop;
    }

    public void setPrintAreaTop(String printAreaTop) {
        this.printAreaTop = printAreaTop;
    }

    public String getPrintAreaLeft() {
        return printAreaLeft;
    }

    public void setPrintAreaLeft(String printAreaLeft) {
        this.printAreaLeft = printAreaLeft;
    }

    public String getPrintAreaWidth() {
        return printAreaWidth;
    }

    public void setPrintAreaWidth(String printAreaWidth) {
        this.printAreaWidth = printAreaWidth;
    }

    public String getPrintAreaHeight() {
        return printAreaHeight;
    }

    public void setPrintAreaHeight(String printAreaHeight) {
        this.printAreaHeight = printAreaHeight;
    }
}
