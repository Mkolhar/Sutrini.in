# Sutrini.in - System Design & Implementation Guide

## 1. High‑Level Design (HLD)

Sutrini is a **multi-tenant SaaS platform** connecting embroidery manufacturers (Tenants) with Customers.

### Component Architecture
*   **Frontend**: Next.js (App Router), TailwindCSS, Stripe Elements.
*   **Backend**: Spring Boot 3.2, MongoDB, Stripe SDK.
*   **Security**: JWT Authentication, RBAC (Admin, Worker, Customer), Tenant Isolation.
*   **Payments**: Stripe PaymentIntents (supporting UPI, Cards).

### Data Flow (End-to-End Checkout)
1.  **Customer** adds items to Cart (Frontend Store).
2.  **Checkout**:
    *   Form collects Shipping Address.
    *   `POST /api/orders` creates Order (Status: PENDING).
3.  **Payment**:
    *   Frontend calls `POST /api/payments/create-payment-intent` with `orderId`.
    *   Backend validates, communicates with **Stripe**, returns `clientSecret`.
    *   Frontend renders `PaymentElement`.
4.  **Confirmation**:
    *   User pays via UPI/Card.
    *   Stripe Webhook (future) updates Order Status to CONFIRMED.

## 2. Low‑Level Design (LLD)

### Database Schema (MongoDB)

#### User Collection
```json
{
  "_id": "uuid",
  "email": "user@example.com",
  "roles": ["CUSTOMER", "ADMIN"],
  "tenantId": "uuid-tenant-1",  // Multi-tenancy Root
  "active": true
}
```

#### Product Collection
```json
{
  "_id": "prod_1",
  "name": "Silk Saree",
  "basePrice": 5000,
  "tenantId": "uuid-tenant-1"   // Ownership
}
```

#### Order Collection
```json
{
  "_id": "order_1",
  "customerId": "user_1",
  "tenantId": "uuid-tenant-1",
  "totalAmount": 5000,
  "status": "PENDING",
  "qrCodeUrl": "base64...",
  "stripePaymentIntentId": "pi_123..."
}
```

### API Contracts (New)

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Registers user and **auto-generates Tenant ID** for MVP. |
| `POST` | `/api/payments/create-payment-intent` | Auth | Creates Stripe Intent for Order. Return `clientSecret`. |

## 3. Implementation Status

### ✅ Completed
1.  **Multi-tenancy Fields**: Added `tenantId` to User, Product, Order.
2.  **Auth Update**: Sign-up now assigns a unique `tenantId` to new users.
3.  **Stripe Integration**:
    *   Backend: `PaymentController`, `pom.xml` dependency.
    *   Frontend: `PaymentSection`, environment variables.
4.  **Checkout Flow**: Updated `checkout/page.tsx` to link Order Creation -> Payment.

### 🚧 Pending / Roadmap
1.  **Product Filtering**: Update `ProductController` to filter by `tenantId`.
2.  **Real-time Tracking**: Implement WebSockets for status updates.
3.  **Webhook Handling**: Implement `/api/payments/webhook` to secure payment confirmation.
4.  **Worker App**: Frontend for scanning QR codes.

## 4. Setup Instructions

1.  **Backend**:
    *   Update `application.properties` with real MongoDB URI and Stripe Secret Key.
    *   Run `mvn spring-boot:run`.
2.  **Frontend**:
    *   Update `.env.local` with `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
    *   Run `npm run dev`.

---
*Created by Antigravity Agent - 2025-12-11*
