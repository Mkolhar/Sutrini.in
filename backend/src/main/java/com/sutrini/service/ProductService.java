package com.sutrini.service;

import com.sutrini.model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAllProducts(String category);

    List<Product> searchProducts(String query);

    Optional<Product> getProductById(String id);

    Product createProduct(Product product);

    Product updateProduct(String id, Product product);

    void deleteProduct(String id);
}
