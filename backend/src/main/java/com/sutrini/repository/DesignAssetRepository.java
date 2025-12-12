package com.sutrini.repository;

import com.sutrini.model.DesignAsset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DesignAssetRepository extends MongoRepository<DesignAsset, String> {
    boolean existsByType(String type);
}
