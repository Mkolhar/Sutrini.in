package com.sutrini.controller;

import com.sutrini.model.DesignAsset;
import com.sutrini.repository.DesignAssetRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/design-assets")
@Tag(name = "Design Assets", description = "Manage design studio configurations (mockups, prices)")
public class DesignAssetController {

    @Autowired
    private DesignAssetRepository repository;

    @GetMapping
    @Operation(summary = "Get all design configurations")
    public List<DesignAsset> getAllAssets() {
        return repository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new design asset (Admin only)")
    public ResponseEntity<DesignAsset> createAsset(@RequestBody DesignAsset asset) {
        if (asset.getType() == null) {
            asset.setType(asset.getName().toLowerCase().replaceAll("\\s+", "-"));
        }
        return ResponseEntity.ok(repository.save(asset));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update a design asset (Admin only)")
    public ResponseEntity<DesignAsset> updateAsset(@PathVariable String id, @RequestBody DesignAsset assetDetails) {
        return repository.findById(id)
                .map(asset -> {
                    asset.setName(assetDetails.getName());
                    asset.setBasePrice(assetDetails.getBasePrice());
                    asset.setMockupImageUrl(assetDetails.getMockupImageUrl());
                    asset.setPrintAreaTop(assetDetails.getPrintAreaTop());
                    asset.setPrintAreaLeft(assetDetails.getPrintAreaLeft());
                    asset.setPrintAreaWidth(assetDetails.getPrintAreaWidth());
                    asset.setPrintAreaHeight(assetDetails.getPrintAreaHeight());
                    return ResponseEntity.ok(repository.save(asset));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a design asset (Admin only)")
    public ResponseEntity<?> deleteAsset(@PathVariable String id) {
        return repository.findById(id)
                .map(asset -> {
                    repository.delete(asset);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
