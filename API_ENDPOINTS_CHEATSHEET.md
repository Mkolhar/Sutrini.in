# 📋 Sutrini Studio API Endpoint Cheatsheet

Quick reference for all API endpoints.

---

## 🌐 Base URL
```
http://localhost:8080
```

---

## 🔐 Authentication

### No Authentication Required

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/signin` | User login → Returns JWT token |
| POST | `/api/auth/signup` | User registration → Creates account |

**Login Request:**
```json
{ "email": "user@example.com", "password": "password123" }
```

**Login Response:**
```json
{
  "token": "eyJhbG...",
  "type": "Bearer",
  "id": "user123",
  "email": "user@example.com",
  "roles": ["CUSTOMER"]
}
```

---

## 🛍️ Products (Consumer)

### No Authentication Required

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/products` | Get all active products |
| GET | `/api/products?category={cat}` | Filter by category |
| GET | `/api/products/{id}` | Get product details |
| GET | `/api/products/search?query={q}` | Search products |

---

## 🔧 Products (Admin)

### 🔒 Requires: ADMIN Role + JWT Token

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/products` | Create new product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

**Product Object:**
```json
{
  "name": "Product Name",
  "description": "Description",
  "category": "sarees",
  "basePrice": 5000.00,
  "images": ["url1", "url2"],
  "availableSizes": ["S","M","L"],
  "availableColors": ["Red","Blue"],
  "stockQuantity": 100,
  "active": true
}
```

---

## 📦 Orders (Consumer)

### 🔒 Requires: JWT Token (Any authenticated user)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/orders` | Create order (auto-generates QR) |
| GET | `/api/orders` | Get my orders |
| GET | `/api/orders/{id}` | Get order details |

**Order Request:**
```json
{
  "items": [
    {
      "productId": "prod123",
      "productName": "Product",
      "quantity": 2,
      "unitPrice": 5000.00,
      "size": "M",
      "color": "Red",
      "customNotes": "Custom instructions"
    }
  ],
  "totalAmount": 10000.00
}
```

---

## 📊 Orders (Admin)

### 🔒 Requires: ADMIN Role + JWT Token

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/orders/all` | Get ALL orders |

### 🔒 Requires: ADMIN or WORKER Role + JWT Token

| Method | Endpoint | Purpose |
|--------|----------|---------|
| PUT | `/api/orders/{id}/status` | Update order status |

**Status Values:** `"PENDING"` `"IN_PROGRESS"` `"COMPLETED"` `"CANCELLED"`

**Update Status Request:**
```json
"IN_PROGRESS"
```

---

## 🔑 Using JWT Token

### In cURL:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/orders
```

### In JavaScript/TypeScript:
```typescript
fetch('http://localhost:8080/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### In Swagger UI:
1. Click **"Authorize"** button
2. Enter: `Bearer YOUR_TOKEN`
3. Click "Authorize"

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success ✅ |
| 400 | Bad Request (validation failed) ❌ |
| 401 | Unauthorized (no/invalid token) 🔒 |
| 403 | Forbidden (insufficient role) 🚫 |
| 404 | Not Found ❓ |

---

## 👥 User Roles

| Role | Can Do |
|------|--------|
| **CUSTOMER** | • Browse products<br>• Place orders<br>• View own orders |
| **WORKER** | • All customer actions<br>• Update order status |
| **ADMIN** | • All worker actions<br>• Create/Update/Delete products<br>• View all orders |

---

## 🎯 Common Workflows

### Customer Journey
```
1. POST /api/auth/signup        → Create account
2. POST /api/auth/signin        → Get token
3. GET  /api/products           → Browse
4. GET  /api/products/{id}      → View details
5. POST /api/orders             → Place order [AUTH]
6. GET  /api/orders             → Track orders [AUTH]
```

### Admin Journey
```
1. POST   /api/auth/signin           → Login (ADMIN)
2. POST   /api/products              → Add product [ADMIN]
3. GET    /api/orders/all            → View orders [ADMIN]
4. PUT    /api/orders/{id}/status    → Update status [ADMIN]
```

---

## 🚀 Testing URLs

**Swagger UI:**
```
http://localhost:8080/swagger-ui.html
```

**OpenAPI JSON:**
```
http://localhost:8080/api-docs
```

---

## 💡 Quick Tips

1. **Get Token First**: Call signin to get JWT
2. **Bearer Prefix**: Always use `Bearer {token}`
3. **Swagger UI**: Best for interactive testing
4. **Role Check**: ADMIN actions require ADMIN role
5. **QR Codes**: Auto-generated on order creation

---

## 📱 Example Requests

### Create Product (Admin)
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Silk Saree",
    "category": "sarees",
    "basePrice": 5000,
    "stockQuantity": 50
  }'
```

### Place Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "prod123",
        "quantity": 1,
        "unitPrice": 5000
      }
    ],
    "totalAmount": 5000
  }'
```

### Search Products
```bash
curl "http://localhost:8080/api/products/search?query=silk"
```

---

**Total Endpoints: 13**  
**Consumer: 8** | **Admin: 5**

✅ All documented in Swagger UI at `/swagger-ui.html`
