package com.sutrini.config;

import com.sutrini.model.DesignAsset;
import com.sutrini.repository.DesignAssetRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(DesignAssetRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new DesignAsset(
                        "T-Shirt",
                        "tshirt",
                        "/mockup-tshirt.png",
                        new BigDecimal("500.00"),
                        "20%", "32%", "36%", "40%"));
                repository.save(new DesignAsset(
                        "Hoodie",
                        "hoodie",
                        "/mockup-hoodie.png",
                        new BigDecimal("950.00"),
                        "30%", "35%", "30%", "25%"));
                System.out.println("Seeded initial Design Assets.");
            }
        };
    }
}
