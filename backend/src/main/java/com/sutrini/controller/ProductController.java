package com.sutrini.controller;

import com.sutrini.model.Product;
import com.sutrini.repository.ProductRepository;
import com.sutrini.dto.MessageResponse;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Product catalog APIs - Consumer endpoints (browse/search) and Admin endpoints (manage products)")
public class ProductController {

    @Autowired
    ProductRepository productRepository;

    @Operation(summary = "Get All Products (Consumer)", description = "Retrieve all active products from the catalog. Optionally filter by category. This is a public endpoint used by consumers to browse the product catalog.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved product list", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)))
    })
    @GetMapping
    public List<Product> getAllProducts(
            @Parameter(description = "Filter products by category (optional)") @RequestParam(required = false) String category) {
        if (category != null) {
            return productRepository.findByCategory(category);
        }
        return productRepository.findByActiveTrue();
    }

    @Operation(summary = "Get Product by ID (Consumer)", description = "Retrieve detailed information about a specific product by its ID. Used by consumers to view product details.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class))),
            @ApiResponse(responseCode = "404", description = "Product not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(
            @Parameter(description = "Product ID", required = true) @PathVariable String id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok(product))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Search Products (Consumer)", description = "Search for products by name (case-insensitive). Returns all products whose names contain the search query.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Search results returned (may be empty)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)))
    })
    @GetMapping("/search")
    public List<Product> searchProducts(
            @Parameter(description = "Search query (product name)", required = true) @RequestParam String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    @Operation(summary = "Create Product (Admin)", description = "Create a new product in the catalog. Requires ADMIN role. Include all product details including name, description, category, pricing, images, sizes, colors, and stock information.", security = @SecurityRequirement(name = "Bearer Authentication"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class), examples = @ExampleObject(name = "Created Product", value = "{\"id\": \"prod123\", \"name\": \"Custom Saree\", \"description\": \"Premium silk saree\", \"category\": \"sarees\", \"basePrice\": 5000, \"stockQuantity\": 10, \"active\": true}"))),
            @ApiResponse(responseCode = "403", description = "Not authorized - Admin role required")
    })
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    @Operation(summary = "Update Product (Admin)", description = "Update an existing product's details. Requires ADMIN role. All product fields can be updated including name, description, pricing, stock, and availability status.", security = @SecurityRequirement(name = "Bearer Authentication"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product updated successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class))),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "403", description = "Not authorized - Admin role required")
    })
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateProduct(
            @Parameter(description = "Product ID", required = true) @PathVariable String id,
            @RequestBody Product productRequest) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(productRequest.getName());
                    product.setDescription(productRequest.getDescription());
                    product.setCategory(productRequest.getCategory());
                    product.setBasePrice(productRequest.getBasePrice());
                    product.setImages(productRequest.getImages());
                    product.setAvailableSizes(productRequest.getAvailableSizes());
                    product.setAvailableColors(productRequest.getAvailableColors());
                    product.setStockQuantity(productRequest.getStockQuantity());
                    product.setActive(productRequest.isActive());
                    return ResponseEntity.ok(productRepository.save(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Delete Product (Admin)", description = "Permanently delete a product from the catalog. Requires ADMIN role. This action cannot be undone.", security = @SecurityRequirement(name = "Bearer Authentication"))
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Product deleted successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = MessageResponse.class), examples = @ExampleObject(name = "Delete Success", value = "{\"message\": \"Product deleted successfully!\"}"))),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "403", description = "Not authorized - Admin role required")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteProduct(
            @Parameter(description = "Product ID", required = true) @PathVariable String id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok(new MessageResponse("Product deleted successfully!"));
        }
        return ResponseEntity.notFound().build();
    }
}
