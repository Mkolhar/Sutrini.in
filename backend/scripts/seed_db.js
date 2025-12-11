/*
 * Seed Script for Sutrini Product Catalog
 * Usage: mongosh localhost:27017/sutrini seed_db.js
 */

db.products.drop(); // Clear existing products to avoid duplicates

db.products.insertMany([
    {
        _id: "prod_001",
        name: "Floral Embroidered Blouse",
        description: "Hand-crafted floral embroidery on premium silk. Perfect for festive occasions.",
        category: "Blouses",
        images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop"],
        basePrice: NumberDecimal("49.99"),
        availableSizes: ["S", "M", "L"],
        availableColors: ["Red", "Green"],
        stockQuantity: 10,
        active: true,
        _class: "com.sutrini.model.Product" // Helper for Spring Data Mapping
    },
    {
        _id: "prod_002",
        name: "Peacock Motif Silk Blouse",
        description: "Traditional peacock design with gold thread work.",
        category: "Blouses",
        images: ["https://images.unsplash.com/photo-1583391733975-20360252b5b9?q=80&w=1000&auto=format&fit=crop"],
        basePrice: NumberDecimal("89.99"),
        availableSizes: ["M", "L", "XL"],
        availableColors: ["Blue", "Pink"],
        stockQuantity: 5,
        active: true,
        _class: "com.sutrini.model.Product"
    },
    {
        _id: "prod_003",
        name: "Geometric Pattern Kurti",
        description: "Modern geometric embroidery on cotton fabric.",
        category: "Kurtis",
        images: ["https://images.unsplash.com/photo-1589810635657-232948472d98?q=80&w=1000&auto=format&fit=crop"],
        basePrice: NumberDecimal("35.50"),
        availableSizes: ["S", "M", "L", "XL"],
        availableColors: ["White", "Black"],
        stockQuantity: 20,
        active: true,
        _class: "com.sutrini.model.Product"
    },
    {
        _id: "prod_004",
        name: "Custom Bridal Design",
        description: "Heavy embroidery work for bridal wear. Fully customizable.",
        category: "Sarees",
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop"],
        basePrice: NumberDecimal("199.99"),
        availableSizes: ["Custom"],
        availableColors: ["Red", "Gold"],
        stockQuantity: 2,
        active: true,
        _class: "com.sutrini.model.Product"
    }
]);

print("Seeding completed. Inserted " + db.products.countDocuments() + " products.");
