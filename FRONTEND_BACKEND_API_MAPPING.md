# Frontend-Backend API Mapping

This document shows the mapping between frontend pages/features and backend API endpoints.

---

## 🎨 Consumer Frontend → Backend APIs

### 1. **Authentication Pages**

#### `/login` Page
- **Purpose**: User login
- **Backend API**: `POST /api/auth/signin`
- **Request**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: JWT token + user details
- **Frontend Action**: Store token, redirect to home/catalog

#### `/signup` or `/register` Page
- **Purpose**: New user registration
- **Backend API**: `POST /api/auth/signup`
- **Request**:
  ```json
  {
    "email": "newuser@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Response**: Success message
- **Frontend Action**: Show success, redirect to login

---

### 2. **Product Catalog Pages**

#### `/catalog` or `/products` Page
- **Purpose**: Browse all products
- **Backend API**: `GET /api/products`
- **Optional Filter**: `GET /api/products?category=sarees`
- **Response**: Array of active products
- **Frontend Features**:
  - Display product grid/list
  - Category filters
  - Sort options

#### `/products/[id]` or `/product-details/[id]` Page
- **Purpose**: View single product details
- **Backend API**: `GET /api/products/{id}`
- **Response**: Full product details
- **Frontend Features**:
  - Image gallery
  - Size/color selection
  - Add to cart button
  - Product description

#### `/search` Page or Search Bar
- **Purpose**: Search products by name
- **Backend API**: `GET /api/products/search?query={searchTerm}`
- **Response**: Matching products
- **Frontend Features**:
  - Search input
  - Real-time results
  - Search suggestions

---

### 3. **Shopping & Orders**

#### `/checkout` or `/place-order` Page
- **Purpose**: Create new order
- **Backend API**: `POST /api/orders`
- **Auth Required**: ✅ JWT Token
- **Request**:
  ```json
  {
    "items": [
      {
        "productId": "prod123",
        "productName": "Silk Saree",
        "quantity": 1,
        "unitPrice": 5000,
        "size": "M",
        "color": "Red",
        "customNotes": "Extra embroidery"
      }
    ],
    "totalAmount": 5000
  }
  ```
- **Response**: Order details with QR code
- **Frontend Actions**:
  - Clear cart
  - Show order confirmation
  - Display QR code
  - Redirect to order details

#### `/orders` or `/my-orders` Page
- **Purpose**: View all user's orders
- **Backend API**: `GET /api/orders`
- **Auth Required**: ✅ JWT Token
- **Response**: Array of user's orders
- **Frontend Features**:
  - Order list/history
  - Order status badges
  - View details button

#### `/orders/[id]` or `/order-details/[id]` Page
- **Purpose**: View specific order
- **Backend API**: `GET /api/orders/{id}`
- **Auth Required**: ✅ JWT Token
- **Response**: Full order details
- **Frontend Features**:
  - Order items list
  - QR code display
  - Status tracking
  - Customer details

---

## 🔧 Admin Portal Frontend → Backend APIs

### 1. **Admin Authentication**

#### `/admin/login` Page
- **Purpose**: Admin login
- **Backend API**: `POST /api/auth/signin`
- **Same as consumer login**, but user must have ADMIN role
- **Frontend Action**: Verify role, redirect to admin dashboard

---

### 2. **Product Management**

#### `/admin/products` Page
- **Purpose**: View & manage all products
- **Backend APIs**:
  - **List Products**: `GET /api/products` (get all, including inactive)
  - **Delete Product**: `DELETE /api/products/{id}`
- **Auth Required**: ✅ ADMIN Role
- **Frontend Features**:
  - Product table/grid
  - Edit/Delete buttons
  - Add new product button
  - Active/Inactive toggle

#### `/admin/products/new` or `/admin/products/create` Page
- **Purpose**: Create new product
- **Backend API**: `POST /api/products`
- **Auth Required**: ✅ ADMIN Role
- **Request**:
  ```json
  {
    "name": "New Product",
    "description": "Product description",
    "category": "sarees",
    "basePrice": 5000,
    "images": ["url1", "url2"],
    "availableSizes": ["S", "M", "L"],
    "availableColors": ["Red", "Blue"],
    "stockQuantity": 100,
    "active": true
  }
  ```
- **Frontend Features**:
  - Product form
  - Image upload/URL input
  - Size/color multi-select
  - Category dropdown

#### `/admin/products/[id]/edit` Page
- **Purpose**: Edit existing product
- **Backend APIs**:
  - **Get Product**: `GET /api/products/{id}` (to populate form)
  - **Update Product**: `PUT /api/products/{id}`
- **Auth Required**: ✅ ADMIN Role
- **Frontend Features**:
  - Pre-filled form
  - Same fields as create
  - Save/Cancel buttons

---

### 3. **Order Management**

#### `/admin/orders` Page
- **Purpose**: View all orders in system
- **Backend API**: `GET /api/orders/all`
- **Auth Required**: ✅ ADMIN Role
- **Response**: All orders from all customers
- **Frontend Features**:
  - Orders table
  - Status filter (Pending, In Progress, Completed, Cancelled)
  - Search by order ID or customer email
  - Update status button

#### `/admin/orders/[id]` Page
- **Purpose**: View order details & update status
- **Backend APIs**:
  - **Get Order**: `GET /api/orders/{id}`
  - **Update Status**: `PUT /api/orders/{id}/status`
- **Auth Required**: ✅ ADMIN or WORKER Role
- **Frontend Features**:
  - Order details
  - Customer information
  - Items list
  - Status dropdown
  - Update button
  - QR code display

---

## 📊 API Usage by Feature

### Consumer Features

| Feature | API Endpoints Used | Auth Required |
|---------|-------------------|---------------|
| **Registration** | POST /api/auth/signup | ❌ |
| **Login** | POST /api/auth/signin | ❌ |
| **Browse Products** | GET /api/products | ❌ |
| **Filter by Category** | GET /api/products?category=X | ❌ |
| **Search Products** | GET /api/products/search?query=X | ❌ |
| **View Product** | GET /api/products/{id} | ❌ |
| **Place Order** | POST /api/orders | ✅ |
| **View My Orders** | GET /api/orders | ✅ |
| **View Order Details** | GET /api/orders/{id} | ✅ |

### Admin Features

| Feature | API Endpoints Used | Auth Required |
|---------|-------------------|---------------|
| **Admin Login** | POST /api/auth/signin | ❌ (but must be ADMIN) |
| **List All Products** | GET /api/products | ✅ ADMIN |
| **Create Product** | POST /api/products | ✅ ADMIN |
| **Update Product** | PUT /api/products/{id} | ✅ ADMIN |
| **Delete Product** | DELETE /api/products/{id} | ✅ ADMIN |
| **View All Orders** | GET /api/orders/all | ✅ ADMIN |
| **View Order Details** | GET /api/orders/{id} | ✅ ADMIN |
| **Update Order Status** | PUT /api/orders/{id}/status | ✅ ADMIN/WORKER |

---

## 🔄 Data Flow Examples

### Example 1: Customer Places Order

```
1. User browses products
   Frontend: GET /api/products
   Backend: Returns all active products
   
2. User clicks on product
   Frontend: GET /api/products/{id}
   Backend: Returns product details
   
3. User adds to cart (frontend state)
   No API call

4. User goes to checkout
   Frontend: POST /api/orders (with JWT token)
   Backend: Creates order, generates QR code
   
5. User sees order confirmation
   Frontend: Displays returned order with QR code
```

### Example 2: Admin Updates Order Status

```
1. Admin logs in
   Frontend: POST /api/auth/signin
   Backend: Returns JWT token with ADMIN role
   
2. Admin views all orders
   Frontend: GET /api/orders/all (with JWT token)
   Backend: Returns all orders
   
3. Admin clicks on specific order
   Frontend: GET /api/orders/{id} (with JWT token)
   Backend: Returns order details
   
4. Admin changes status to "IN_PROGRESS"
   Frontend: PUT /api/orders/{id}/status (with JWT token)
   Backend: Updates order, returns updated order
   
5. Frontend refreshes order display
   Shows updated status
```

### Example 3: Admin Adds New Product

```
1. Admin navigates to "Add Product" page
   Frontend form loads
   
2. Admin fills in product details
   Frontend validates form
   
3. Admin clicks "Create Product"
   Frontend: POST /api/products (with JWT token)
   Backend: Saves product, returns created product
   
4. Frontend redirects to products list
   GET /api/products (shows new product)
```

---

## 🎯 Frontend State Management Suggestions

### Authentication State
```typescript
// Store after login
{
  token: "jwt-token-here",
  user: {
    id: "user123",
    email: "user@example.com",
    roles: ["CUSTOMER"] // or ["ADMIN"]
  }
}
```

### Product State (Catalog Page)
```typescript
{
  products: Product[],
  loading: boolean,
  error: string | null,
  selectedCategory: string | null,
  searchQuery: string
}
```

### Shopping Cart State (Frontend Only)
```typescript
{
  items: CartItem[],
  totalAmount: number
}
// Convert to Order format when placing order
```

### Order State (My Orders Page)
```typescript
{
  orders: Order[],
  loading: boolean,
  selectedOrder: Order | null
}
```

---

## 📱 Axios/Fetch Examples

### Setting up API client with Auth

```typescript
// api/client.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

### Using the client

```typescript
// api/products.ts
import apiClient from './client';

export const getProducts = (category?: string) => {
  const params = category ? { category } : {};
  return apiClient.get('/api/products', { params });
};

export const searchProducts = (query: string) => {
  return apiClient.get('/api/products/search', { params: { query } });
};

export const getProduct = (id: string) => {
  return apiClient.get(`/api/products/${id}`);
};

// Admin only
export const createProduct = (product: Product) => {
  return apiClient.post('/api/products', product);
};
```

```typescript
// api/orders.ts
import apiClient from './client';

export const createOrder = (order: Order) => {
  return apiClient.post('/api/orders', order);
};

export const getUserOrders = () => {
  return apiClient.get('/api/orders');
};

export const getOrder = (id: string) => {
  return apiClient.get(`/api/orders/${id}`);
};

// Admin only
export const getAllOrders = () => {
  return apiClient.get('/api/orders/all');
};

export const updateOrderStatus = (id: string, status: OrderStatus) => {
  return apiClient.put(`/api/orders/${id}/status`, status);
};
```

---

## 🔒 Protected Routes

### Consumer Frontend
```typescript
// Protect these routes - require authentication
- /checkout
- /orders
- /orders/[id]
- /profile (if exists)

// Public routes
- /
- /catalog
- /products
- /products/[id]
- /search
- /login
- /signup
```

### Admin Frontend
```typescript
// All admin routes require ADMIN role
- /admin/dashboard
- /admin/products
- /admin/products/new
- /admin/products/[id]/edit
- /admin/orders
- /admin/orders/[id]

// Check role after login:
if (user.roles.includes('ADMIN')) {
  // Allow access
} else {
  // Redirect to consumer site
}
```

---

## 🎨 UI Component Mapping

### Consumer Components

| Component | API Calls |
|-----------|-----------|
| **Navbar** | None (uses auth state) |
| **ProductCard** | None (receives product as prop) |
| **ProductGrid** | GET /api/products |
| **ProductDetail** | GET /api/products/{id} |
| **SearchBar** | GET /api/products/search |
| **CategoryFilter** | GET /api/products?category=X |
| **ShoppingCart** | None (local state) |
| **CheckoutForm** | POST /api/orders |
| **OrderList** | GET /api/orders |
| **OrderCard** | GET /api/orders/{id} |
| **QRCodeDisplay** | None (displays QR from order data) |

### Admin Components

| Component | API Calls |
|-----------|-----------|
| **AdminSidebar** | None (navigation only) |
| **ProductTable** | GET /api/products |
| **ProductForm** | POST/PUT /api/products/{id} |
| **OrderTable** | GET /api/orders/all |
| **OrderDetails** | GET /api/orders/{id} |
| **StatusUpdater** | PUT /api/orders/{id}/status |

---

## 📋 Summary

- **Consumer Frontend**: 9 API endpoints (3 public + 6 authenticated)
- **Admin Frontend**: 8 API endpoints (all require ADMIN role)
- **Shared**: Authentication endpoints used by both
- **Total Unique Endpoints**: 13

All frontend pages and components now have clear mapping to backend APIs! 🎉
