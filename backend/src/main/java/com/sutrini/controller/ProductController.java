package com.sutrini.controller;

import com.sutrini.model.Product;
import com.sutrini.service.ProductService;
import com.sutrini.dto.MessageResponse;
import com.sutrini.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Products", description = "Product catalog APIs - Consumer endpoints (browse/search) and Admin endpoints (manage products)")
public class ProductController {

        private final ProductService productService;

        public ProductController(ProductService productService) {
                this.productService = productService;
        }

        @Operation(summary = "Get All Products (Consumer)", description = "Retrieve all active products from the catalog. Optionally filter by category. This is a public endpoint used by consumers to browse the product catalog.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Successfully retrieved product list", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)))
        })
        @GetMapping
        public List<Product> getAllProducts(
                        @Parameter(description = "Filter products by category (optional)") @RequestParam(required = false) String category) {
                return productService.getAllProducts(category);
        }

        @Operation(summary = "Get Product by ID (Consumer)", description = "Retrieve detailed information about a specific product by its ID. Used by consumers to view product details.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Product found", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class))),
                        @ApiResponse(responseCode = "404", description = "Product not found")
        })
        @GetMapping("/{id}")
        public ResponseEntity<?> getProductById(
                        @Parameter(description = "Product ID", required = true) @PathVariable String id) {
                return productService.getProductById(id)
                                .map(ResponseEntity::ok)
                                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        }

        @Operation(summary = "Search Products (Consumer)", description = "Search for products by name (case-insensitive). Returns all products whose names contain the search query.")
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Search results returned (may be empty)", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class)))
        })
        @GetMapping("/search")
        public List<Product> searchProducts(
                        @Parameter(description = "Search query (product name)", required = true) @RequestParam String query) {
                return productService.searchProducts(query);
        }

        @Operation(summary = "Create Product (Admin)", description = "Create a new product in the catalog. Requires ADMIN role. Include all product details including name, description, category, pricing, images, sizes, colors, and stock information.", security = @SecurityRequirement(name = "Bearer Authentication"))
        @ApiResponses(value = {
                        @ApiResponse(responseCode = "200", description = "Product created successfully", content = @Content(mediaType = "application/json", schema = @Schema(implementation = Product.class), examples = @ExampleObject(name = "Created Product", value = "{\"id\": \"prod123\", \"name\": \"Custom Saree\", \"description\": \"Premium silk saree\", \"category\": \"sarees\", \"basePrice\": 5000, \"stockQuantity\": 10, \"active\": true}"))),
                        @ApiResponse(responseCode = "403", description = "Not authorized - Admin role required")
        })
        @PostMapping
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
                return ResponseEntity.ok(productService.createProduct(product));
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
                        @Valid @RequestBody Product productRequest) {
                return ResponseEntity.ok(productService.updateProduct(id, productRequest));
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
                productService.deleteProduct(id);
                return ResponseEntity.ok(new MessageResponse("Product deleted successfully!"));
        }
}
