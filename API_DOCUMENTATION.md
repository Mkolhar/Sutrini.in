# Sutrini Studio API Documentation

## Overview

This document provides comprehensive documentation for the Sutrini Studio API, covering both **Consumer-facing** and **Admin Portal** endpoints.

**Base URL:** `http://localhost:8080`  
**Swagger UI:** `http://localhost:8080/swagger-ui.html`  
**OpenAPI Spec:** `http://localhost:8080/api-docs`

## Authentication

Most endpoints require JWT Bearer token authentication. To obtain a token:

1. **Sign Up** (if new user): `POST /api/auth/signup`
2. **Sign In**: `POST /api/auth/signin`
3. Include the returned token in subsequent requests:
   ```
   Authorization: Bearer {your-jwt-token}
   ```

## API Endpoints Summary

### 🔐 Authentication APIs (`/api/auth`)
Used by both consumers and administrators for account management.

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/auth/signin` | User login | ❌ | - |
| POST | `/api/auth/signup` | User registration | ❌ | - |

---

### 🛍️ Product APIs (`/api/products`)

#### Consumer Endpoints (Public/No Auth)
Browse and search products in the catalog.

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/products` | Get all active products (optionally filter by category) | ❌ | - |
| GET | `/api/products/{id}` | Get product details by ID | ❌ | - |
| GET | `/api/products/search?query={query}` | Search products by name | ❌ | - |

#### Admin Endpoints
Manage product catalog (requires authentication and admin privileges).

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/products` | Create new product | ✅ | ADMIN |
| PUT | `/api/products/{id}` | Update product | ✅ | ADMIN |
| DELETE | `/api/products/{id}` | Delete product | ✅ | ADMIN |

---

### 📦 Order APIs (`/api/orders`)

#### Consumer Endpoints
Place and track orders.

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| POST | `/api/orders` | Create new order | ✅ | - |
| GET | `/api/orders` | Get all orders for logged-in user | ✅ | - |
| GET | `/api/orders/{id}` | Get order details by ID | ✅ | - |

#### Admin/Worker Endpoints
Monitor and manage all orders.

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/api/orders/all` | Get all orders in system | ✅ | ADMIN |
| PUT | `/api/orders/{id}/status` | Update order status | ✅ | ADMIN/WORKER |

---

## Detailed API Documentation

### Authentication APIs

#### 1. Sign In
**Endpoint:** `POST /api/auth/signin`

**Description:** Authenticate user credentials and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "user123",
  "email": "user@example.com",
  "roles": ["CUSTOMER"]
}
```

**Error Response (401 Unauthorized):**
Invalid credentials

---

#### 2. Sign Up
**Endpoint:** `POST /api/auth/signup`

**Description:** Register a new user account. Default role is CUSTOMER.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "roles": ["customer"]  // Optional: "admin", "worker", "customer"
}
```

**Response (200 OK):**
```json
{
  "message": "User registered successfully!"
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Error: Email is already in use!"
}
```

---

### Product APIs (Consumer)

#### 1. Get All Products
**Endpoint:** `GET /api/products?category={category}`

**Description:** Retrieve all active products. Optionally filter by category.

**Query Parameters:**
- `category` (optional): Filter by product category (e.g., "sarees", "blouses", "fabrics")

**Response (200 OK):**
```json
[
  {
    "id": "prod123",
    "name": "Custom Silk Saree",
    "description": "Premium quality silk saree",
    "category": "sarees",
    "basePrice": 5000.00,
    "images": ["https://example.com/img1.jpg"],
    "availableSizes": ["S", "M", "L"],
    "availableColors": ["Red", "Blue"],
    "stockQuantity": 50,
    "active": true
  }
]
```

---

#### 2. Get Product by ID
**Endpoint:** `GET /api/products/{id}`

**Description:** Retrieve detailed information about a specific product.

**Path Parameters:**
- `id`: Product ID

**Response (200 OK):**
```json
{
  "id": "prod123",
  "name": "Custom Silk Saree",
  "description": "Premium quality silk saree with traditional design",
  "category": "sarees",
  "basePrice": 5000.00,
  "images": ["https://example.com/img1.jpg", "https://example.com/img2.jpg"],
  "availableSizes": ["S", "M", "L", "XL"],
  "availableColors": ["Red", "Blue", "Black"],
  "stockQuantity": 50,
  "active": true
}
```

**Error Response (404 Not Found):**
Product not found

---

#### 3. Search Products
**Endpoint:** `GET /api/products/search?query={query}`

**Description:** Search products by name (case-insensitive).

**Query Parameters:**
- `query`: Search term

**Response (200 OK):**
```json
[
  {
    "id": "prod123",
    "name": "Custom Silk Saree",
    "description": "Premium quality silk saree",
    "category": "sarees",
    "basePrice": 5000.00,
    "stockQuantity": 50
  }
]
```

---

### Product APIs (Admin)

#### 4. Create Product
**Endpoint:** `POST /api/products`

**Description:** Create a new product. Requires ADMIN role.

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Request Body:**
```json
{
  "name": "Custom Silk Saree",
  "description": "Premium quality silk saree with traditional design",
  "category": "sarees",
  "basePrice": 5000.00,
  "images": ["https://example.com/img1.jpg"],
  "availableSizes": ["S", "M", "L", "XL"],
  "availableColors": ["Red", "Blue", "Black"],
  "stockQuantity": 50,
  "active": true
}
```

**Response (200 OK):**
```json
{
  "id": "prod123",
  "name": "Custom Silk Saree",
  "description": "Premium quality silk saree with traditional design",
  "category": "sarees",
  "basePrice": 5000.00,
  "images": ["https://example.com/img1.jpg"],
  "availableSizes": ["S", "M", "L", "XL"],
  "availableColors": ["Red", "Blue", "Black"],
  "stockQuantity": 50,
  "active": true
}
```

**Error Response (403 Forbidden):**
Not authorized - Admin role required

---

#### 5. Update Product
**Endpoint:** `PUT /api/products/{id}`

**Description:** Update an existing product. Requires ADMIN role.

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Path Parameters:**
- `id`: Product ID

**Request Body:** (All fields from Create Product)

**Response (200 OK):** Updated product object

**Error Responses:**
- `404 Not Found`: Product not found
- `403 Forbidden`: Not authorized

---

#### 6. Delete Product
**Endpoint:** `DELETE /api/products/{id}`

**Description:** Permanently delete a product. Requires ADMIN role.

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Path Parameters:**
- `id`: Product ID

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully!"
}
```

**Error Responses:**
- `404 Not Found`: Product not found
- `403 Forbidden`: Not authorized

---

### Order APIs (Consumer)

#### 1. Create Order
**Endpoint:** `POST /api/orders`

**Description:** Place a new order. Automatically generates QR code for tracking.

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "prod123",
      "productName": "Custom Silk Saree",
      "quantity": 2,
      "unitPrice": 5000.00,
      "size": "M",
      "color": "Red",
      "customNotes": "Please add extra embroidery"
    }
  ],
  "totalAmount": 10000.00
}
```

**Response (200 OK):**
```json
{
  "id": "order123",
  "customerId": "user123",
  "customerEmail": "user@example.com",
  "items": [...],
  "totalAmount": 10000.00,
  "status": "PENDING",
  "createdAt": "2024-12-10T12:00:00",
  "qrCodeUrl": "data:image/png;base64,iVBORw0KGgo..."
}
```

---

#### 2. Get User Orders
**Endpoint:** `GET /api/orders`

**Description:** Retrieve all orders for the authenticated user.

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Response (200 OK):**
```json
[
  {
    "id": "order123",
    "customerId": "user123",
    "customerEmail": "user@example.com",
    "items": [...],
    "totalAmount": 10000.00,
    "status": "PENDING",
    "createdAt": "2024-12-10T12:00:00",
    "qrCodeUrl": "data:image/png;base64,..."
  }
]
```

---

#### 3. Get Order by ID
**Endpoint:** `GET /api/orders/{id}`

**Description:** Get detailed information about a specific order.

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Path Parameters:**
- `id`: Order ID

**Response (200 OK):** Order object

**Error Response (404 Not Found):** Order not found

---

### Order APIs (Admin/Worker)

#### 4. Get All Orders
**Endpoint:** `GET /api/orders/all`

**Description:** Retrieve all orders in the system. Requires ADMIN role.

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Response (200 OK):** Array of all order objects

**Error Response (403 Forbidden):** Not authorized

---

#### 5. Update Order Status
**Endpoint:** `PUT /api/orders/{id}/status`

**Description:** Update order status. Requires ADMIN or WORKER role.

**Headers:**
```
Authorization: Bearer {jwt-token}
```

**Path Parameters:**
- `id`: Order ID

**Request Body:**
```json
"IN_PROGRESS"
```

**Allowed Values:**
- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

**Response (200 OK):** Updated order object

**Error Responses:**
- `404 Not Found`: Order not found
- `403 Forbidden`: Not authorized

---

## Data Models

### Product
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "category": "string",
  "basePrice": "number",
  "images": ["string"],
  "availableSizes": ["string"],
  "availableColors": ["string"],
  "stockQuantity": "number",
  "active": "boolean"
}
```

### Order
```json
{
  "id": "string",
  "customerId": "string",
  "customerEmail": "string",
  "items": [OrderItem],
  "totalAmount": "number",
  "status": "PENDING | IN_PROGRESS | COMPLETED | CANCELLED",
  "createdAt": "datetime",
  "qrCodeUrl": "string"
}
```

### OrderItem
```json
{
  "productId": "string",
  "productName": "string",
  "quantity": "number",
  "unitPrice": "number",
  "size": "string",
  "color": "string",
  "customNotes": "string"
}
```

---

## User Roles

- **CUSTOMER**: Default role for regular users
  - Can browse products
  - Can place and track orders
  
- **WORKER**: Staff role
  - Can update order status
  
- **ADMIN**: Administrative role
  - Full access to all endpoints
  - Can manage products
  - Can view all orders
  - Can update order status

---

## Error Handling

All error responses follow this format:

```json
{
  "message": "Error description"
}
```

Common HTTP Status Codes:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required or invalid credentials
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Testing with Swagger UI

1. Start the backend server: `mvn spring-boot:run`
2. Navigate to: `http://localhost:8080/swagger-ui.html`
3. Click "Authorize" button (green lock icon)
4. Enter your JWT token in the format: `Bearer {your-token}`
5. Test endpoints directly from the UI

---

## Example Workflow

### Consumer Flow
1. **Register**: `POST /api/auth/signup`
2. **Login**: `POST /api/auth/signin` → Get JWT token
3. **Browse Products**: `GET /api/products`
4. **View Product Details**: `GET /api/products/{id}`
5. **Place Order**: `POST /api/orders` (with JWT token)
6. **Track Orders**: `GET /api/orders` (with JWT token)

### Admin Flow
1. **Login as Admin**: `POST /api/auth/signin` → Get JWT token
2. **Add Product**: `POST /api/products` (with JWT token)
3. **View All Orders**: `GET /api/orders/all` (with JWT token)
4. **Update Order Status**: `PUT /api/orders/{id}/status` (with JWT token)

---

## Notes

- All timestamps are in ISO 8601 format
- Prices are in BigDecimal for precision
- QR codes are generated automatically when orders are created
- Product images should be hosted externally (URLs provided)
- MongoDB is used as the database

---

**Last Updated:** December 2024  
**API Version:** 1.0.0
