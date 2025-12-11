package com.sutrini;

import com.sutrini.model.Role;
import com.sutrini.model.User;
import com.sutrini.model.Product;
import com.sutrini.repository.UserRepository;
import com.sutrini.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@SpringBootApplication
public class SutriniApplication {

	public static void main(String[] args) {
		SpringApplication.run(SutriniApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UserRepository userRepository, ProductRepository productRepository,
			PasswordEncoder passwordEncoder) {
		return args -> {
			// Seed Admin User
			if (!userRepository.existsByEmail("admin@sutrini.com")) {
				User admin = new User();
				admin.setEmail("admin@sutrini.com");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setFirstName("Admin");
				admin.setLastName("User");
				admin.setRoles(Set.of(Role.ADMIN));
				userRepository.save(admin);
				System.out.println("Admin user created: admin@sutrini.com / admin123");
			}

			// Seed Products
			if (productRepository.count() == 0) {
				seedProducts(productRepository);
				System.out.println("Sample products seeded.");
			}
		};
	}

	private void seedProducts(ProductRepository productRepository) {
		Product p1 = new Product();
		p1.setName("Floral Embroidered Blouse");
		p1.setDescription("Hand-crafted floral embroidery on premium silk. Perfect for festive occasions.");
		p1.setCategory("Blouses");
		p1.setImages(java.util.List
				.of("https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop"));
		p1.setBasePrice(new java.math.BigDecimal("49.99"));
		p1.setAvailableSizes(java.util.List.of("S", "M", "L"));
		p1.setAvailableColors(java.util.List.of("Red", "Green"));
		p1.setStockQuantity(10);
		p1.setActive(true);
		productRepository.save(p1);

		Product p2 = new Product();
		p2.setName("Peacock Motif Silk Blouse");
		p2.setDescription("Traditional peacock design with gold thread work.");
		p2.setCategory("Blouses");
		p2.setImages(java.util.List
				.of("https://images.unsplash.com/photo-1583391733975-20360252b5b9?q=80&w=1000&auto=format&fit=crop"));
		p2.setBasePrice(new java.math.BigDecimal("89.99"));
		p2.setAvailableSizes(java.util.List.of("M", "L", "XL"));
		p2.setAvailableColors(java.util.List.of("Blue", "Pink"));
		p2.setStockQuantity(5);
		p2.setActive(true);
		productRepository.save(p2);

		Product p3 = new Product();
		p3.setName("Geometric Pattern Kurti");
		p3.setDescription("Modern geometric embroidery on cotton fabric.");
		p3.setCategory("Kurtis");
		p3.setImages(java.util.List
				.of("https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=1000&auto=format&fit=crop"));
		p3.setBasePrice(new java.math.BigDecimal("35.50"));
		p3.setAvailableSizes(java.util.List.of("S", "M", "L", "XL"));
		p3.setAvailableColors(java.util.List.of("White", "Black"));
		p3.setStockQuantity(20);
		p3.setActive(true);
		productRepository.save(p3);

		Product p4 = new Product();
		p4.setName("Custom Bridal Design");
		p4.setDescription("Heavy embroidery work for bridal wear. Fully customizable.");
		p4.setCategory("Sarees");
		p4.setImages(java.util.List
				.of("https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop"));
		p4.setBasePrice(new java.math.BigDecimal("199.99"));
		p4.setAvailableSizes(java.util.List.of("Custom"));
		p4.setAvailableColors(java.util.List.of("Red", "Gold"));
		p4.setStockQuantity(2);
		p4.setActive(true);
		productRepository.save(p4);
	}

}
