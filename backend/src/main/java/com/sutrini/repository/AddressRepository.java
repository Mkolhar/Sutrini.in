package com.sutrini.repository;

import com.sutrini.model.Address;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AddressRepository extends MongoRepository<Address, String> {
    List<Address> findByUserIdAndActiveTrue(String userId);
}
