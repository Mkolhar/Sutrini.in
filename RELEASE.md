# Release Notes

## v0.3.3 (2025-12-12)

### Features & Fixes
- **Design Studio Order Fix**: Resolved issue where authenticated users could not place orders from the Design Studio.
- **Authentication Handling**: Improved frontend API client to gracefully handle 401 Unauthorized responses by clearing invalid tokens and redirecting to login.
- **Backend Security**: Updated OrderController and SecurityConfig to ensure proper user context is available for order creation.
- **Database Seeding**: Updated seed script to ensure consistency with new constraints.

### Impact
- Users can now successfully place orders for custom designs.
- Smoother user experience when session expires.
