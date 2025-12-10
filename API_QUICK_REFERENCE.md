# Sutrini Studio API Quick Reference

## 🚀 Quick Start

**Swagger UI:** http://localhost:8080/swagger-ui.html  
**OpenAPI Spec:** http://localhost:8080/api-docs

---

## 📋 API Endpoints Quick Reference

### Authentication (Public)
```
POST   /api/auth/signin   - User login
POST   /api/auth/signup   - User registration
```

### Products - Consumer (Public)
```
GET    /api/products              - Get all active products (filter by ?category=)
GET    /api/products/{id}         - Get product by ID
GET    /api/products/search       - Search products (?query=)
```

### Products - Admin (Auth Required: ADMIN)
```
POST   /api/products              - Create product
PUT    /api/products/{id}         - Update product
DELETE /api/products/{id}         - Delete product
```

### Orders - Consumer (Auth Required)
```
POST   /api/orders                - Create order
GET    /api/orders                - Get user's orders
GET    /api/orders/{id}           - Get order by ID
```

### Orders - Admin/Worker (Auth Required: ADMIN or WORKER)
```
GET    /api/orders/all            - Get all orders (ADMIN only)
PUT    /api/orders/{id}/status    - Update order status (ADMIN/WORKER)
```

---

## 🔑 Authentication Flow

### 1. Register New User
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "user123",
  "email": "user@example.com",
  "roles": ["CUSTOMER"]
}
```

### 3. Use Token in Subsequent Requests
```bash
curl -X GET http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📦 Common Examples

### Get All Products
```bash
curl http://localhost:8080/api/products
```

### Filter Products by Category
```bash
curl http://localhost:8080/api/products?category=sarees
```

### Search Products
```bash
curl http://localhost:8080/api/products/search?query=silk
```

### Create Product (Admin)
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Custom Silk Saree",
    "description": "Premium quality silk saree",
    "category": "sarees",
    "basePrice": 5000.00,
    "images": ["https://example.com/img1.jpg"],
    "availableSizes": ["S", "M", "L", "XL"],
    "availableColors": ["Red", "Blue", "Black"],
    "stockQuantity": 50,
    "active": true
  }'
```

### Create Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod123",
        "productName": "Custom Silk Saree",
        "quantity": 2,
        "unitPrice": 5000.00,
        "size": "M",
        "color": "Red",
        "customNotes": "Extra embroidery"
      }
    ],
    "totalAmount": 10000.00
  }'
```

### Update Order Status (Admin/Worker)
```bash
curl -X PUT http://localhost:8080/api/orders/order123/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '"IN_PROGRESS"'
```

---

## 🎭 User Roles & Permissions

| Role | Products (Read) | Products (Write) | Orders (Own) | Orders (All) | Order Status |
|------|----------------|------------------|--------------|--------------|--------------|
| **Public** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **CUSTOMER** | ✅ | ❌ | ✅ | ❌ | ❌ |
| **WORKER** | ✅ | ❌ | ✅ | ❌ | ✅ |
| **ADMIN** | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 📊 Order Status Values

- `PENDING` - Order placed, awaiting processing
- `IN_PROGRESS` - Order is being fulfilled
- `COMPLETED` - Order completed and delivered
- `CANCELLED` - Order cancelled

---

## 🛠️ Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## 💡 Tips

1. **Swagger UI** is the easiest way to test APIs interactively
2. Use the **Authorize** button in Swagger UI to set your JWT token once
3. **QR codes** are automatically generated for each order
4. **Product images** should be URLs to externally hosted images
5. All **prices** are in BigDecimal format for accuracy
6. **Timestamps** are in ISO 8601 format

---

## 🔧 Development Tools

### Using Postman
1. Import the OpenAPI spec from: `http://localhost:8080/api-docs`
2. Set up Bearer token authentication in the Collection
3. Start testing!

### Using Swagger UI
1. Navigate to: `http://localhost:8080/swagger-ui.html`
2. Click "Authorize" and enter: `Bearer YOUR_TOKEN`
3. Try out endpoints directly

---

## 📝 Frontend Integration

### Example: Fetch Products (React/Next.js)
```typescript
const fetchProducts = async () => {
  const response = await fetch('http://localhost:8080/api/products');
  const products = await response.json();
  return products;
};
```

### Example: Create Order (Authenticated)
```typescript
const createOrder = async (orderData: Order, token: string) => {
  const response = await fetch('http://localhost:8080/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
  return await response.json();
};
```

---

**For full documentation, see:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
