package com.sutrini.repository;

import com.sutrini.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomerId(String customerId);

    List<Order> findByStatus(String status); // Will need fix for Enum if query by string
}
