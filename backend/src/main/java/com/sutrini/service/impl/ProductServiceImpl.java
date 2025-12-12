package com.sutrini.service.impl;

import com.sutrini.exception.ResourceNotFoundException;
import com.sutrini.model.Product;
import com.sutrini.repository.ProductRepository;
import com.sutrini.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts(String category) {
        if (category != null) {
            return productRepository.findByCategory(category);
        }
        return productRepository.findByActiveTrue();
    }

    @Override
    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }

    @Override
    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(String id, Product productRequest) {
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
                    return productRepository.save(product);
                })
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    @Override
    public void deleteProduct(String id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }
}
