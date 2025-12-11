Embro factory # 🚀 **EmbroidMe Platform - Detailed Product Requirements Document (PRD)**

## **1. EXECUTIVE SUMMARY**

### **Product Vision**
Sutrini Studio  is a comprehensive digital platform that revolutionizes the custom embroidery manufacturing industry by providing an end-to-end solution for order management, production tracking, and customer engagement through innovative QR-based workflows and modern technology stack.

### **Business Objectives**
- **Revenue Target**: $2.5M+ annual revenue within 12 months
- **Market Share**: Capture 15% of the custom embroidery market in target regions
- **Operational Efficiency**: 70% reduction in order processing time
- **Customer Satisfaction**: Achieve 4.8/5 customer rating
- **Quality Assurance**: 99.5% order accuracy rate
- **Scalability**: Support 10,000+ orders/day with 1000+ concurrent users

---

## **2. PRODUCT OVERVIEW**

### **Core Value Proposition**
Transform traditional embroidery manufacturing into a modern, digital-first operation with real-time tracking, automated workflows, and exceptional customer experience.

### **Target Market Segments**
1. **Small Embroidery Businesses** (50-200 orders/month)
2. **Medium Embroidery Manufacturers** (200-1000 orders/month)
3. **Large Corporate Clients** (1000+ orders/month)
4. **Individual Customers** (1-10 orders/month)

### **Key Differentiators**
1. **QR Code Workflow Integration**: First-to-market QR-based production tracking
2. **Real-time Customer Portal**: Amazon/Flipkart-inspired user experience
3. **Integrated Payment Processing**: Seamless Stripe integration with multiple payment methods
4. **Advanced Analytics**: Business intelligence and performance metrics
5. **Mobile-First Design**: Optimized for factory workers and customers
6. **Multi-language Support**: Global market reach
7. **AI-Powered Features**: Intelligent pricing and recommendations

---

## **3. DETAILED FEATURE SPECIFICATIONS**

### **3.1 CUSTOMER PORTAL (FRONTEND)**

#### **3.1.1 User Authentication & Registration**

**Feature**: Comprehensive user management system with multiple authentication methods

**Functional Requirements**:
- **Email/Password Registration**
  - Email validation with confirmation link
  - Password strength requirements (minimum 8 characters, uppercase, lowercase, number, special character)
  - Account activation via email verification
  - Password reset functionality with secure token

- **Social Login Integration**
  - Google OAuth 2.0 integration
  - Facebook Login integration
  - Apple Sign-In (for iOS users)
  - LinkedIn integration (for B2B customers)

- **JWT-Based Session Management**
  - Secure token generation and validation
  - Token refresh mechanism
  - Session timeout configuration (30 minutes idle, 24 hours max)
  - Multi-device session support

- **Role-Based Access Control**
  - Customer role (basic access)
  - Premium customer role (advanced features)
  - Corporate customer role (bulk ordering, approval workflows)
  - Admin role (full system access)

**Technical Implementation**:
```typescript
// Authentication Service
interface AuthService {
  register(email: string, password: string, userData: UserData): Promise<User>
  login(email: string, password: string): Promise<AuthResponse>
  socialLogin(provider: 'google' | 'facebook' | 'apple'): Promise<AuthResponse>
  refreshToken(refreshToken: string): Promise<AuthResponse>
  logout(): Promise<void>
  resetPassword(email: string): Promise<void>
  changePassword(oldPassword: string, newPassword: string): Promise<void>
}

// User Management
interface UserService {
  getProfile(): Promise<UserProfile>
  updateProfile(profile: Partial<UserProfile>): Promise<UserProfile>
  deleteAccount(): Promise<void>
  getOrderHistory(page: number, limit: number): Promise<OrderHistory>
}
```

**UI/UX Requirements**:
- Clean, modern login/registration forms
- Progressive disclosure for registration steps
- Social login buttons with brand colors
- Password strength indicator
- Email verification success/error states
- Responsive design for mobile devices

#### **3.1.2 Product Catalog & Search**

**Feature**: Comprehensive product browsing and search functionality

**Functional Requirements**:
- **Product Categories**
  - Hierarchical category structure (e.g., Apparel > T-Shirts > Cotton)
  - Dynamic category management
  - Category-based filtering and sorting
  - Featured categories on homepage

- **Advanced Search**
  - Full-text search across product names, descriptions, and tags
  - Autocomplete suggestions
  - Search history and recent searches
  - Search result highlighting
  - Fuzzy matching for typos

- **Product Filtering**
  - Price range filter (slider with min/max values)
  - Size filter (XS, S, M, L, XL, XXL, Custom)
  - Color filter (with color swatches)
  - Material filter (Cotton, Polyester, Wool, Silk, etc.)
  - Brand filter (if applicable)
  - Availability filter (In Stock, Out of Stock, Pre-order)

- **Product Sorting**
  - Price (Low to High, High to Low)
  - Name (A-Z, Z-A)
  - Popularity (Most viewed, Most ordered)
  - Newest (Recently added)
  - Rating (Highest rated)

**Technical Implementation**:
```typescript
// Product Service
interface ProductService {
  getProducts(filters: ProductFilters, sort: SortOptions, page: number): Promise<ProductPage>
  getProduct(id: string): Promise<Product>
  searchProducts(query: string, filters: ProductFilters): Promise<ProductSearchResult>
  getCategories(): Promise<Category[]>
  getProductRecommendations(userId: string): Promise<Product[]>
  getRelatedProducts(productId: string): Promise<Product[]>
}

// Product Data Structure
interface Product {
  id: string
  name: string
  description: string
  category: Category
  images: ProductImage[]
  variants: ProductVariant[]
  pricing: PricingInfo
  customization: CustomizationOptions
  availability: AvailabilityInfo
  ratings: RatingInfo
  tags: string[]
  metadata: ProductMetadata
}

interface ProductVariant {
  id: string
  size: string
  color: string
  material: string
  stockQuantity: number
  price: number
  embroideryArea: EmbroideryArea[]
}
```

**UI/UX Requirements**:
- Grid and list view options
- Infinite scroll or pagination
- Product image gallery with zoom
- Quick view modal for product details
- Wishlist functionality
- Share product functionality
- Product comparison tool

#### **3.1.3 Shopping Cart & Checkout**

**Feature**: Seamless shopping experience with advanced cart management

**Functional Requirements**:
- **Shopping Cart Management**
  - Add/remove items with quantity adjustment
  - Save cart for later (persistent across sessions)
  - Cart expiration (7 days)
  - Bulk quantity updates
  - Cart sharing via link

- **Real-time Price Calculation**
  - Base product price
  - Embroidery customization costs
  - Quantity discounts
  - Rush order fees
  - Tax calculation (based on shipping address)
  - Shipping costs
  - Promotional discounts

- **Checkout Process**
  - Multi-step checkout (5 steps)
  - Guest checkout option
  - Address validation and autocomplete
  - Multiple shipping options
  - Payment method selection
  - Order review and confirmation
  - Order number generation

**Technical Implementation**:
```typescript
// Cart Service
interface CartService {
  addItem(productId: string, variantId: string, quantity: number, customization: Customization): Promise<Cart>
  removeItem(itemId: string): Promise<Cart>
  updateQuantity(itemId: string, quantity: number): Promise<Cart>
  getCart(): Promise<Cart>
  clearCart(): Promise<void>
  saveForLater(): Promise<void>
  applyPromoCode(code: string): Promise<Cart>
  calculateTotals(): Promise<CartTotals>
}

// Checkout Service
interface CheckoutService {
  validateAddress(address: Address): Promise<AddressValidation>
  getShippingOptions(address: Address): Promise<ShippingOption[]>
  calculateTax(address: Address, items: CartItem[]): Promise<TaxCalculation>
  processPayment(paymentData: PaymentData): Promise<PaymentResult>
  createOrder(orderData: OrderData): Promise<Order>
  sendOrderConfirmation(order: Order): Promise<void>
}

// Cart Data Structure
interface Cart {
  id: string
  items: CartItem[]
  totals: CartTotals
  appliedPromos: PromoCode[]
  shippingAddress?: Address
  billingAddress?: Address
  paymentMethod?: PaymentMethod
  estimatedDelivery?: Date
}

interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
  customization: Customization
  price: PriceBreakdown
}
```

**UI/UX Requirements**:
- Persistent cart across browser sessions
- Real-time price updates
- Progress indicator for checkout steps
- Address autocomplete with Google Maps API
- Payment method icons and security badges
- Order summary with expandable details
- Mobile-optimized checkout flow

#### **3.1.4 Order Tracking & Management**

**Feature**: Real-time order tracking with comprehensive status updates

**Functional Requirements**:
- **Order Status Tracking**
  - Real-time status updates via WebSocket
  - Status history with timestamps
  - Estimated delivery dates
  - Production progress indicators
  - Quality check milestones

- **Order Notifications**
  - Email notifications for status changes
  - SMS notifications for critical updates
  - Push notifications (mobile app)
  - In-app notifications
  - Customizable notification preferences

- **Order History**
  - Complete order history with search
  - Order details and receipts
  - Reorder functionality
  - Order cancellation requests
  - Return/refund requests

**Technical Implementation**:
```typescript
// Order Tracking Service
interface OrderTrackingService {
  getOrderStatus(orderId: string): Promise<OrderStatus>
  getOrderHistory(orderId: string): Promise<OrderStatusHistory[]>
  subscribeToUpdates(orderId: string): Observable<OrderUpdate>
  getEstimatedDelivery(orderId: string): Promise<DeliveryEstimate>
  requestCancellation(orderId: string, reason: string): Promise<CancellationRequest>
  requestRefund(orderId: string, reason: string): Promise<RefundRequest>
}

// Order Status Data Structure
interface OrderStatus {
  orderId: string
  currentStatus: OrderStatusEnum
  statusHistory: OrderStatusHistory[]
  estimatedDelivery: Date
  actualDelivery?: Date
  trackingNumber?: string
  qrCode?: string
  productionProgress: ProductionProgress
  qualityChecks: QualityCheck[]
}

interface OrderStatusHistory {
  status: OrderStatusEnum
  timestamp: Date
  updatedBy: string
  notes?: string
  location?: string
  qrScanned?: boolean
}

enum OrderStatusEnum {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  CONFIRMED = 'CONFIRMED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  EMBROIDERY_COMPLETE = 'EMBROIDERY_COMPLETE',
  QUALITY_CHECK = 'QUALITY_CHECK',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}
```

**UI/UX Requirements**:
- Timeline view of order progress
- Progress bar with percentage completion
- Status cards with icons and descriptions
- Map integration for delivery tracking
- QR code display for factory operations
- Mobile-responsive tracking interface

#### **3.1.5 Customization Tools**

**Feature**: Advanced design upload and customization interface

**Functional Requirements**:
- **Design Upload**
  - Multiple file format support (PNG, JPG, SVG, AI, EPS)
  - File size limits (max 10MB)
  - Image optimization and compression
  - Design validation (resolution, color mode)
  - Design preview with embroidery simulation

- **Design Positioning**
  - Drag-and-drop positioning
  - Snap-to-grid functionality
  - Rotation and scaling tools
  - Mirror and flip options
  - Multiple design placement

- **Color Customization**
  - Thread color selection
  - Color matching to uploaded designs
  - Pantone color integration
  - Custom color input
  - Color preview on product

- **Size and Stitch Customization**
  - Embroidery size adjustment
  - Stitch density options
  - Stitch type selection
  - Border and outline options
  - Text customization

**Technical Implementation**:
```typescript
// Design Upload Service
interface DesignUploadService {
  uploadDesign(file: File): Promise<DesignUploadResult>
  validateDesign(file: File): Promise<DesignValidation>
  optimizeDesign(design: Design): Promise<OptimizedDesign>
  previewDesign(design: Design, product: Product): Promise<DesignPreview>
  calculatePricing(design: Design, product: Product): Promise<PricingBreakdown>
}

// Customization Service
interface CustomizationService {
  positionDesign(design: Design, position: Position): Promise<Design>
  adjustColors(design: Design, colors: Color[]): Promise<Design>
  resizeDesign(design: Design, size: Size): Promise<Design>
  addText(text: TextCustomization): Promise<Design>
  applyEffects(design: Design, effects: Effect[]): Promise<Design>
}

// Design Data Structure
interface Design {
  id: string
  originalFile: File
  optimizedFile: string
  thumbnail: string
  dimensions: Dimensions
  colors: Color[]
  position: Position
  size: Size
  rotation: number
  effects: Effect[]
  pricing: PricingBreakdown
}

interface DesignPreview {
  frontView: string
  backView: string
  sideView: string
  closeUp: string
  mockup: string
}
```

**UI/UX Requirements**:
- Drag-and-drop file upload area
- Real-time design preview
- Zoom and pan controls
- Color picker with thread samples
- Size slider with visual feedback
- Undo/redo functionality
- Save design drafts

### **3.2 BUSINESS DASHBOARD (ADMIN)**

#### **3.2.1 Order Management Dashboard**

**Feature**: Comprehensive order management interface for business operations

**Functional Requirements**:
- **Order Queue Management**
  - Real-time order dashboard with live updates
  - Status-based filtering and sorting
  - Bulk operations (status updates, printing)
  - Priority management and reordering
  - Order assignment to workers

- **Production Planning**
  - Workload distribution across workers
  - Resource allocation and capacity planning
  - Timeline management with Gantt charts
  - Machine scheduling and optimization
  - Material requirement planning

- **Quality Control**
  - Quality check workflows
  - Defect tracking and reporting
  - Rework management
  - Quality metrics and analytics
  - Supplier quality assessment

**Technical Implementation**:
```typescript
// Order Management Service
interface OrderManagementService {
  getOrderQueue(filters: OrderFilters): Promise<OrderQueue>
  updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<Order>
  bulkUpdateStatus(orderIds: string[], status: OrderStatus): Promise<BulkUpdateResult>
  assignOrder(orderId: string, workerId: string): Promise<Order>
  getProductionSchedule(date: Date): Promise<ProductionSchedule>
  getQualityMetrics(dateRange: DateRange): Promise<QualityMetrics>
}

// Dashboard Data Structure
interface OrderQueue {
  pending: Order[]
  inProduction: Order[]
  qualityCheck: Order[]
  readyForPickup: Order[]
  shipped: Order[]
  delivered: Order[]
  cancelled: Order[]
  statistics: QueueStatistics
}

interface ProductionSchedule {
  date: Date
  workers: WorkerSchedule[]
  machines: MachineSchedule[]
  orders: ScheduledOrder[]
  capacity: CapacityInfo
}
```

**UI/UX Requirements**:
- Kanban board view for order management
- Drag-and-drop order assignment
- Real-time notifications for new orders
- Calendar view for production scheduling
- Dashboard widgets with key metrics
- Mobile-responsive admin interface

#### **3.2.2 Customer Management**

**Feature**: Comprehensive customer database and relationship management

**Functional Requirements**:
- **Customer Database**
  - Customer profiles with complete history
  - Communication preferences and history
  - Order patterns and analytics
  - Customer segmentation and tagging
  - Credit limit management

- **Communication Tools**
  - Automated notification system
  - Manual messaging interface
  - Email template management
  - SMS integration
  - Communication analytics

- **Customer Analytics**
  - Customer lifetime value calculation
  - Purchase frequency analysis
  - Customer satisfaction metrics
  - Churn prediction
  - Customer behavior insights

**Technical Implementation**:
```typescript
// Customer Management Service
interface CustomerManagementService {
  getCustomers(filters: CustomerFilters): Promise<CustomerPage>
  getCustomerProfile(customerId: string): Promise<CustomerProfile>
  updateCustomer(customerId: string, data: CustomerData): Promise<Customer>
  getCustomerOrders(customerId: string): Promise<Order[]>
  getCustomerAnalytics(customerId: string): Promise<CustomerAnalytics>
  sendMessage(customerId: string, message: Message): Promise<MessageResult>
}

// Customer Data Structure
interface CustomerProfile {
  id: string
  personalInfo: PersonalInfo
  contactInfo: ContactInfo
  preferences: CustomerPreferences
  orderHistory: OrderSummary[]
  communicationHistory: CommunicationRecord[]
  analytics: CustomerAnalytics
  tags: string[]
  notes: Note[]
}

interface CustomerAnalytics {
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: Date
  customerLifetimeValue: number
  purchaseFrequency: number
  satisfactionScore: number
  churnRisk: number
}
```

**UI/UX Requirements**:
- Customer search with advanced filters
- Customer profile cards with key information
- Communication history timeline
- Customer analytics dashboard
- Bulk messaging interface
- Customer segmentation tools

#### **3.2.3 Analytics & Reporting**

**Feature**: Comprehensive business intelligence and reporting system

**Functional Requirements**:
- **Sales Analytics**
  - Revenue tracking and forecasting
  - Sales performance by period
  - Product performance analysis
  - Customer acquisition metrics
  - Conversion rate analysis

- **Operational Analytics**
  - Production efficiency metrics
  - Quality control statistics
  - Delivery performance tracking
  - Resource utilization analysis
  - Cost analysis and profitability

- **Custom Reports**
  - Report builder with drag-and-drop interface
  - Scheduled report generation
  - Export to multiple formats (PDF, Excel, CSV)
  - Report sharing and collaboration
  - Automated report delivery

**Technical Implementation**:
```typescript
// Analytics Service
interface AnalyticsService {
  getSalesMetrics(dateRange: DateRange): Promise<SalesMetrics>
  getOperationalMetrics(dateRange: DateRange): Promise<OperationalMetrics>
  getCustomerMetrics(dateRange: DateRange): Promise<CustomerMetrics>
  generateCustomReport(reportConfig: ReportConfig): Promise<Report>
  scheduleReport(reportConfig: ReportConfig, schedule: Schedule): Promise<ScheduledReport>
  exportReport(reportId: string, format: ExportFormat): Promise<ExportResult>
}

// Analytics Data Structure
interface SalesMetrics {
  totalRevenue: number
  revenueGrowth: number
  averageOrderValue: number
  conversionRate: number
  topProducts: ProductPerformance[]
  topCustomers: CustomerPerformance[]
  salesByPeriod: PeriodData[]
}

interface OperationalMetrics {
  productionEfficiency: number
  qualityScore: number
  deliveryOnTime: number
  averageProductionTime: number
  resourceUtilization: number
  costPerOrder: number
  defectRate: number
}
```

**UI/UX Requirements**:
- Interactive charts and graphs
- Real-time dashboard updates
- Drill-down capabilities
- Customizable dashboard layouts
- Mobile-responsive analytics
- Export and sharing options

### **3.3 FACTORY OPERATIONS**

#### **3.3.1 QR Code Workflow System**

**Feature**: Innovative QR code-based production tracking system

**Functional Requirements**:
- **QR Code Generation**
  - Automatic QR code creation for each order
  - Unique identifiers with order information
  - Mobile-optimized scanning
  - Offline capability for factory environments
  - Batch QR code generation

- **Production Tracking**
  - Status updates via QR code scan
  - Worker assignment and tracking
  - Time tracking per production stage
  - Quality check integration
  - Real-time progress updates

- **Mobile Factory App**
  - Native mobile application for workers
  - Offline-first design
  - Simple scan-and-update interface
  - Photo capture for quality checks
  - Voice notes and comments

**Technical Implementation**:
```typescript
// QR Code Service
interface QRCodeService {
  generateQRCode(orderId: string): Promise<QRCode>
  generateBatchQRCodes(orderIds: string[]): Promise<QRCode[]>
  scanQRCode(qrContent: string): Promise<OrderInfo>
  updateOrderStatus(qrContent: string, status: OrderStatus, workerId: string): Promise<OrderUpdate>
  getQRCodeHistory(qrCodeId: string): Promise<QRCodeHistory>
}

// Factory Mobile App Service
interface FactoryAppService {
  login(workerId: string, password: string): Promise<WorkerSession>
  getAssignedOrders(workerId: string): Promise<Order[]>
  scanQRCode(qrContent: string): Promise<OrderDetails>
  updateStatus(orderId: string, status: OrderStatus, notes?: string): Promise<OrderUpdate>
  capturePhoto(orderId: string, photo: File, type: PhotoType): Promise<PhotoUpload>
  addVoiceNote(orderId: string, audio: File): Promise<VoiceNote>
}

// QR Code Data Structure
interface QRCode {
  id: string
  content: string
  orderId: string
  orderNumber: string
  generatedAt: Date
  lastScannedAt?: Date
  scanCount: number
  isActive: boolean
  metadata: QRCodeMetadata
}

interface QRCodeHistory {
  qrCodeId: string
  scans: QRCodeScan[]
  statusUpdates: StatusUpdate[]
  photos: Photo[]
  voiceNotes: VoiceNote[]
}
```

**UI/UX Requirements**:
- Simple, intuitive mobile interface
- Large, easy-to-tap buttons
- Clear status indicators
- Offline mode with sync
- Photo capture with quality indicators
- Voice input for hands-free operation

#### **3.3.2 Quality Control System**

**Feature**: Comprehensive quality control and assurance system

**Functional Requirements**:
- **Multi-stage Quality Checks**
  - Pre-production validation
  - In-process quality checks
  - Final quality inspection
  - Rework management
  - Quality metrics tracking

- **Quality Metrics**
  - Defect tracking and categorization
  - Quality scores and ratings
  - Improvement recommendations
  - Supplier quality assessment
  - Quality trend analysis

- **Quality Documentation**
  - Photo documentation of issues
  - Voice notes and comments
  - Quality check checklists
  - Approval workflows
  - Quality reports generation

**Technical Implementation**:
```typescript
// Quality Control Service
interface QualityControlService {
  createQualityCheck(orderId: string, stage: QualityStage): Promise<QualityCheck>
  performQualityCheck(checkId: string, results: QualityResults): Promise<QualityCheck>
  documentIssue(orderId: string, issue: QualityIssue): Promise<QualityIssue>
  approveQuality(orderId: string, approverId: string): Promise<QualityApproval>
  getQualityMetrics(dateRange: DateRange): Promise<QualityMetrics>
}

// Quality Data Structure
interface QualityCheck {
  id: string
  orderId: string
  stage: QualityStage
  checklist: QualityChecklist
  results: QualityResults
  photos: Photo[]
  notes: string
  checkedBy: string
  checkedAt: Date
  status: QualityStatus
}

interface QualityIssue {
  id: string
  orderId: string
  category: IssueCategory
  severity: IssueSeverity
  description: string
  photos: Photo[]
  assignedTo: string
  status: IssueStatus
  resolution: string
  resolvedAt?: Date
}

enum QualityStage {
  PRE_PRODUCTION = 'PRE_PRODUCTION',
  IN_PROCESS = 'IN_PROCESS',
  FINAL_INSPECTION = 'FINAL_INSPECTION',
  PACKAGING = 'PACKAGING'
}
```

**UI/UX Requirements**:
- Step-by-step quality check interface
- Photo capture with annotation tools
- Voice input for hands-free operation
- Quality issue categorization
- Approval workflow interface
- Quality metrics dashboard

### **3.4 PAYMENT & BILLING SYSTEM**

#### **3.4.1 Payment Processing**

**Feature**: Comprehensive payment processing with multiple payment methods

**Functional Requirements**:
- **Multiple Payment Methods**
  - Credit/debit cards (Visa, MasterCard, American Express)
  - Digital wallets (PayPal, Apple Pay, Google Pay)
  - Bank transfers (ACH, wire transfers)
  - Cash on delivery
  - Buy now, pay later options

- **Payment Security**
  - PCI DSS compliance
  - 3D Secure authentication
  - Fraud detection and prevention
  - Secure tokenization
  - Encryption at rest and in transit

- **Payment Workflows**
  - Pre-authorization for large orders
  - Partial payments for custom orders
  - Payment plan support
  - Automatic retry for failed payments
  - Payment reconciliation

**Technical Implementation**:
```typescript
// Payment Service
interface PaymentService {
  createPaymentIntent(amount: number, currency: string, paymentMethod: PaymentMethod): Promise<PaymentIntent>
  processPayment(paymentData: PaymentData): Promise<PaymentResult>
  authorizePayment(paymentId: string, amount: number): Promise<AuthorizationResult>
  capturePayment(paymentId: string, amount: number): Promise<CaptureResult>
  refundPayment(paymentId: string, amount: number, reason: string): Promise<RefundResult>
  getPaymentHistory(orderId: string): Promise<PaymentHistory>
}

// Payment Data Structure
interface PaymentData {
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  billingAddress: Address
  customerInfo: CustomerInfo
  metadata: PaymentMetadata
}

interface PaymentResult {
  paymentId: string
  status: PaymentStatus
  transactionId: string
  amount: number
  currency: string
  processedAt: Date
  gatewayResponse: GatewayResponse
  fraudScore?: number
}

enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'
}
```

**UI/UX Requirements**:
- Secure payment form with validation
- Payment method selection with icons
- Real-time payment status updates
- Payment confirmation interface
- Payment history and receipts
- Mobile-optimized payment flow

#### **3.4.2 Billing Management**

**Feature**: Comprehensive billing and invoice management system

**Functional Requirements**:
- **Invoice Generation**
  - Automatic invoice creation
  - Tax calculation based on location
  - Multiple currency support
  - PDF generation with branding
  - Email delivery

- **Billing Workflows**
  - Recurring billing for subscription orders
  - Proforma invoices for custom orders
  - Credit memo generation
  - Payment plan management
  - Late payment handling

- **Financial Reporting**
  - Revenue recognition
  - Accounts receivable tracking
  - Payment reconciliation
  - Financial statement generation
  - Tax reporting

**Technical Implementation**:
```typescript
// Billing Service
interface BillingService {
  generateInvoice(orderId: string): Promise<Invoice>
  calculateTax(address: Address, items: OrderItem[]): Promise<TaxCalculation>
  sendInvoice(invoiceId: string, email: string): Promise<EmailResult>
  createPaymentPlan(orderId: string, plan: PaymentPlan): Promise<PaymentPlan>
  processRecurringBilling(): Promise<RecurringBillingResult>
  generateFinancialReport(dateRange: DateRange): Promise<FinancialReport>
}

// Invoice Data Structure
interface Invoice {
  id: string
  invoiceNumber: string
  orderId: string
  customer: CustomerInfo
  items: InvoiceItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  status: InvoiceStatus
  dueDate: Date
  paidDate?: Date
  pdfUrl: string
}

interface TaxCalculation {
  subtotal: number
  taxAmount: number
  taxRate: number
  taxBreakdown: TaxBreakdown[]
  total: number
}
```

**UI/UX Requirements**:
- Professional invoice design
- Tax calculation display
- Payment plan interface
- Financial dashboard
- Export options for accounting
- Mobile-responsive billing interface

---

## **4. TECHNICAL ARCHITECTURE**

### **4.1 System Architecture**

**Monorepo Structure**:
```
embroidery-platform/
├── frontend/                 # Next.js 14 + TypeScript
│   ├── app/                 # App Router with customer & business portals
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utilities and configurations
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service layer
│   └── types/               # TypeScript type definitions
├── backend/                 # Spring Boot 3.2 + Java 17
│   ├── src/main/java/
│   │   └── com/embroidery/order/
│   │       ├── application/     # Application services
│   │       ├── domain/          # Domain models and business logic
│   │       ├── infrastructure/  # External integrations
│   │       └── interfaces/      # REST controllers
│   └── src/test/            # Comprehensive test suite
├── mobile/                  # React Native factory app
├── shared/                  # Shared types and utilities
└── docs/                    # Documentation
```

### **4.2 Technology Stack**

#### **Frontend (Next.js 14)**
```typescript
// Core Technologies
- Next.js 14 with App Router
- TypeScript 5.3 (strict mode)
- React 18 with concurrent features
- Tailwind CSS 3.4 for styling
- Framer Motion for animations

// State Management
- Zustand for global state
- React Query for server state
- React Hook Form for forms
- Zod for validation

// UI Components
- Radix UI primitives
- Headless UI components
- Custom design system
- Responsive design patterns

// Development Tools
- ESLint + Prettier
- Husky for git hooks
- Jest + React Testing Library
- Cypress for E2E testing
```

#### **Backend (Spring Boot 3.2)**
```java
// Core Framework
- Spring Boot 3.2
- Spring Security 6.2
- Spring Data MongoDB
- Spring WebFlux for reactive endpoints
- Spring Cloud for microservices

// Database & Caching
- MongoDB 7.0 (primary database)
- Redis 7.0 (caching and sessions)
- Elasticsearch 8.0 (search engine)
- MinIO (S3-compatible storage)

// Message Queue & Events
- Apache Kafka 3.0
- Spring Cloud Stream
- Event sourcing patterns
- CQRS implementation

// Security & Authentication
- JWT tokens
- OAuth 2.0 integration
- Role-based access control
- API rate limiting
- CORS configuration
```

#### **Mobile App (React Native)**
```typescript
// Core Framework
- React Native 0.72
- TypeScript 5.3
- Expo SDK 49

// Navigation & State
- React Navigation 6
- Redux Toolkit
- AsyncStorage for offline data

// Camera & QR Code
- Expo Camera
- react-native-qrcode-scanner
- Image picker and manipulation

// Offline Support
- WatermelonDB for local storage
- React Query for sync
- Background sync capabilities
```

### **4.3 Database Design**

#### **MongoDB Collections**
```javascript
// Orders Collection
{
  _id: ObjectId,
  orderNumber: String,
  customerId: String,
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    companyName: String
  },
  items: [{
    productId: String,
    productName: String,
    quantity: Number,
    unitPrice: Number,
    customization: {
      design: String,
      colors: [String],
      size: String,
      position: String
    }
  }],
  status: String,
  statusHistory: [{
    status: String,
    timestamp: Date,
    updatedBy: String,
    notes: String
  }],
  payment: {
    paymentId: String,
    method: String,
    status: String,
    amount: Number,
    currency: String
  },
  shippingAddress: {
    streetAddress: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  qrCode: {
    qrCodeId: String,
    content: String,
    generatedAt: Date
  },
  totalAmount: Number,
  currency: String,
  createdAt: Date,
  updatedAt: Date,
  estimatedDeliveryDate: Date,
  actualDeliveryDate: Date
}

// Products Collection
{
  _id: ObjectId,
  name: String,
  description: String,
  category: String,
  images: [String],
  variants: [{
    size: String,
    color: String,
    material: String,
    price: Number,
    stockQuantity: Number
  }],
  customization: {
    embroideryAreas: [{
      name: String,
      maxSize: String,
      allowedColors: [String]
    }],
    stitchTypes: [String],
    threadColors: [String]
  },
  pricing: {
    basePrice: Number,
    embroideryPricing: {
      small: Number,
      medium: Number,
      large: Number
    }
  },
  availability: Boolean,
  tags: [String],
  metadata: Object
}

// Customers Collection
{
  _id: ObjectId,
  email: String,
  firstName: String,
  lastName: String,
  phone: String,
  companyName: String,
  addresses: [{
    type: String,
    streetAddress: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
    isDefault: Boolean
  }],
  preferences: {
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    },
    currency: String,
    language: String
  },
  orderHistory: [{
    orderId: String,
    orderNumber: String,
    totalAmount: Number,
    status: String,
    orderDate: Date
  }],
  analytics: {
    totalOrders: Number,
    totalSpent: Number,
    averageOrderValue: Number,
    lastOrderDate: Date,
    customerLifetimeValue: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### **4.4 API Design**

#### **RESTful API Endpoints**
```typescript
// Customer API
GET    /api/v1/customers/profile
PUT    /api/v1/customers/profile
POST   /api/v1/customers/register
POST   /api/v1/customers/login
POST   /api/v1/customers/logout
POST   /api/v1/customers/forgot-password
POST   /api/v1/customers/reset-password

// Products API
GET    /api/v1/products
GET    /api/v1/products/:id
GET    /api/v1/products/search
GET    /api/v1/products/categories
GET    /api/v1/products/:id/variants

// Orders API
POST   /api/v1/orders
GET    /api/v1/orders
GET    /api/v1/orders/:id
PUT    /api/v1/orders/:id/status
GET    /api/v1/orders/:id/tracking
POST   /api/v1/orders/:id/cancel

// Cart API
GET    /api/v1/cart
POST   /api/v1/cart/items
PUT    /api/v1/cart/items/:id
DELETE /api/v1/cart/items/:id
POST   /api/v1/cart/clear

// Checkout API
POST   /api/v1/checkout/validate
POST   /api/v1/checkout/shipping
POST   /api/v1/checkout/payment
POST   /api/v1/checkout/confirm

// Admin API
GET    /api/v1/admin/orders
PUT    /api/v1/admin/orders/:id
GET    /api/v1/admin/customers
GET    /api/v1/admin/analytics
GET    /api/v1/admin/reports

// Factory API
POST   /api/v1/factory/scan-qr
PUT    /api/v1/factory/orders/:id/status
POST   /api/v1/factory/orders/:id/photos
POST   /api/v1/factory/orders/:id/quality-check
```

#### **WebSocket Events**
```typescript
// Real-time Updates
interface WebSocketEvents {
  // Order Status Updates
  'order.status.updated': {
    orderId: string
    status: OrderStatus
    timestamp: Date
    updatedBy: string
  }
  
  // New Orders
  'order.created': {
    order: Order
    timestamp: Date
  }
  
  // Production Updates
  'production.progress': {
    orderId: string
    stage: ProductionStage
    progress: number
    estimatedCompletion: Date
  }
  
  // Quality Check Updates
  'quality.check.completed': {
    orderId: string
    stage: QualityStage
    result: QualityResult
    checkedBy: string
  }
  
  // Payment Updates
  'payment.processed': {
    orderId: string
    status: PaymentStatus
    amount: number
    transactionId: string
  }
}
```

---

## **5. SECURITY REQUIREMENTS**

### **5.1 Authentication & Authorization**

#### **JWT Token Management**
```typescript
// Token Structure
interface JWTPayload {
  sub: string           // User ID
  email: string         // User email
  roles: string[]       // User roles
  permissions: string[] // User permissions
  iat: number          // Issued at
  exp: number          // Expiration time
  jti: string          // JWT ID for revocation
}

// Token Configuration
const JWT_CONFIG = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  issuer: 'embroidme-platform',
  audience: 'embroidme-users',
  algorithm: 'RS256'
}
```

#### **Role-Based Access Control**
```typescript
// User Roles
enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PREMIUM_CUSTOMER = 'PREMIUM_CUSTOMER',
  CORPORATE_CUSTOMER = 'CORPORATE_CUSTOMER',
  WORKER = 'WORKER',
  SUPERVISOR = 'SUPERVISOR',
  ADMIN = 'ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN'
}

// Permissions
enum Permission {
  // Order permissions
  CREATE_ORDER = 'CREATE_ORDER',
  VIEW_OWN_ORDERS = 'VIEW_OWN_ORDERS',
  VIEW_ALL_ORDERS = 'VIEW_ALL_ORDERS',
  UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS',
  CANCEL_ORDER = 'CANCEL_ORDER',
  
  // Customer permissions
  VIEW_CUSTOMER_PROFILE = 'VIEW_CUSTOMER_PROFILE',
  UPDATE_CUSTOMER_PROFILE = 'UPDATE_CUSTOMER_PROFILE',
  VIEW_ALL_CUSTOMERS = 'VIEW_ALL_CUSTOMERS',
  
  // Product permissions
  VIEW_PRODUCTS = 'VIEW_PRODUCTS',
  MANAGE_PRODUCTS = 'MANAGE_PRODUCTS',
  
  // Analytics permissions
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  EXPORT_REPORTS = 'EXPORT_REPORTS',
  
  // System permissions
  MANAGE_USERS = 'MANAGE_USERS',
  SYSTEM_CONFIGURATION = 'SYSTEM_CONFIGURATION'
}
```

### **5.2 Data Protection**

#### **Encryption Standards**
```typescript
// Data Encryption
interface EncryptionConfig {
  algorithm: 'AES-256-GCM'
  keyRotation: '30d'
  atRest: {
    database: 'AES-256'
    fileStorage: 'AES-256'
    backups: 'AES-256'
  }
  inTransit: {
    api: 'TLS 1.3'
    database: 'TLS 1.3'
    fileTransfer: 'TLS 1.3'
  }
}

// Sensitive Data Handling
interface SensitiveDataConfig {
  piiFields: ['email', 'phone', 'address', 'paymentInfo']
  masking: {
    email: '***@***.com'
    phone: '***-***-****'
    creditCard: '****-****-****-****'
  }
  retention: {
    orderData: '7y'
    customerData: '7y'
    paymentData: '7y'
    auditLogs: '10y'
  }
}
```

### **5.3 API Security**

#### **Rate Limiting**
```typescript
// Rate Limiting Configuration
interface RateLimitConfig {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: {
    public: 100,      // Public endpoints
    authenticated: 1000, // Authenticated users
    admin: 10000      // Admin users
  },
  skipSuccessfulRequests: false,
  skipFailedRequests: false
}

// Endpoint-specific limits
const ENDPOINT_LIMITS = {
  '/api/v1/auth/login': { max: 5, windowMs: 15 * 60 * 1000 },
  '/api/v1/orders': { max: 100, windowMs: 60 * 1000 },
  '/api/v1/checkout': { max: 10, windowMs: 60 * 1000 }
}
```

#### **Input Validation**
```typescript
// Validation Schemas
const ORDER_VALIDATION = z.object({
  customer: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    email: z.string().email(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/)
  }),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    customization: z.object({
      design: z.string().optional(),
      colors: z.array(z.string()).max(10),
      size: z.string().max(20)
    })
  })).min(1),
  shippingAddress: z.object({
    streetAddress: z.string().min(5).max(200),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postalCode: z.string().min(3).max(20),
    country: z.string().length(2)
  })
})
```

---

## **6. PERFORMANCE REQUIREMENTS**

### **6.1 Response Time Targets**
```typescript
// Performance Targets
const PERFORMANCE_TARGETS = {
  // API Response Times
  api: {
    p95: 200,    // 95% of requests under 200ms
    p99: 500,    // 99% of requests under 500ms
    max: 1000    // Maximum response time 1 second
  },
  
  // Page Load Times
  frontend: {
    firstContentfulPaint: 1.5,    // 1.5 seconds
    largestContentfulPaint: 2.5,  // 2.5 seconds
    timeToInteractive: 3.0        // 3.0 seconds
  },
  
  // Database Query Times
  database: {
    simpleQueries: 50,     // 50ms
    complexQueries: 200,   // 200ms
    aggregations: 500      // 500ms
  }
}
```

### **6.2 Scalability Requirements**
```typescript
// Scalability Targets
const SCALABILITY_TARGETS = {
  // Concurrent Users
  concurrentUsers: {
    peak: 1000,
    sustained: 500,
    growth: '20% monthly'
  },
  
  // Order Volume
  orders: {
    daily: 10000,
    peakHour: 1000,
    growth: '15% monthly'
  },
  
  // Data Storage
  storage: {
    initial: '100GB',
    growth: '50GB monthly',
    retention: '7 years'
  }
}
```

### **6.3 Caching Strategy**
```typescript
// Caching Configuration
interface CacheConfig {
  // Redis Caching
  redis: {

the detail of the product we are trying build by BA is as fallowed 
**Document: Digitized Embroidered Clothing Platform - Product & Engineering Specification**

---

**Master Prompt for AI & Engineering Tools**

"You are developing a comprehensive digital platform for an embroidered clothing business. This includes two major interfaces: (1) a **Customer Portal** that offers a seamless e-commerce experience, and (2) a **Factory/Admin Portal** that facilitates full order lifecycle management.

Customers can browse a design catalog, customize embroidery, place orders, make payments via Stripe, track their order in real-time, and manage profile data. The factory-side handles order intake, QR code generation for each order, batch QR-based status updates, inventory management, automated notifications, and performance analytics.

Technologies include: Spring Boot with Java for backend microservices, MongoDB for flexible data modeling, Apache Kafka for asynchronous event handling, and React/Next.js for responsive frontend UI. System must support full CRUD, real-time WebSocket communication, and scale to handle concurrent customer orders and backend operations. Ensure every feature has testable P0 flows and clear business logic validation."

Use this master prompt to reinitialize or expand development within AI tools, ensuring continuity of system scope and functionality.

---

**Part 1: Product Manager Document (For Product Team)**

**Project Overview**
Digitize and scale the embroidered clothing business with a two-sided platform:

1. **Customer Portal** – Online catalog, order flow, and tracking.
2. **Admin Portal** – Internal operations, manufacturing visibility, and automated logistics.

---

### **Customer Portal - Features, Pages, Acceptance Criteria & P0 Flows**

#### Pages:

* **Homepage** (Design categories, featured collections)
* **Product Detail Page** (Zoom, customization panel)
* **Cart & Checkout Page** (Stripe/UPI integration)
* **Profile Page** (Order history, repeat order)
* **Order Tracking Page** (Live status timeline)

#### 1. **Browse Catalog**

* **Description**: Browse categorized designs with filters.
* **Acceptance Criteria**:

  * Images load by category and respond to filter input.
  * Individual product opens to detailed view.
* **P0 Flow**:

  * Homepage → Select category → Load filtered list → Click product → View detail

#### 2. **Product Customization**

* **Description**: Upload design, choose size, preview embroidery.
* **Acceptance Criteria**:

  * Preview renders correctly for uploaded design.
  * Chosen options stored until checkout.
* **P0 Flow**:

  * Product page → Upload image → Select options → Add to cart → Validate summary at checkout

#### 3. **Order Placement & Payment**

* **Description**: Place an order through Stripe or UPI.
* **Acceptance Criteria**:

  * Orders submit only on payment success.
  * Failure redirects back with error.
* **P0 Flow**:

  * Add to cart → Checkout → Complete payment → Confirmation page

#### 4. **Order Tracking**

* **Description**: Real-time visibility over order lifecycle.
* **Acceptance Criteria**:

  * WebSocket reflects status changes.
  * Timeline UI matches backend updates.
* **P0 Flow**:

  * Login → My Orders → Track Order → Verify timeline as status changes

#### 5. **User Profile & History**

* **Description**: View and manage user account and orders.
* **Acceptance Criteria**:

  * Secure login required.
  * Accurate rendering of all past orders.
* **P0 Flow**:

  * Login → View profile → Check previous orders → Repeat purchase from history

---

### **Admin Portal - Features, Pages, Acceptance Criteria & P0 Flows**

#### Pages:

* **Admin Dashboard** (KPIs, new orders)
* **Order Management** (Search/filter/update)
* **QR Management** (Generate & bulk scan)
* **Inventory Management** (Products, restocking)
* **Notification Center** (Templates and logs)
* **Reports Page** (Analytics and downloads)

#### 1. **Order Dashboard**

* **Description**: Central hub for tracking and processing customer orders.
* **Acceptance Criteria**:

  * Orders searchable by ID, phone number, or name.
  * Status changes propagate to customer UI.
* **P0 Flow**:

  * Admin login → Search order → Update status → Confirm on customer view

#### 2. **QR Code Integration**

* **Description**: Generate QR upon order creation; scan to update status.
* **Acceptance Criteria**:

  * QR links uniquely to order.
  * QR scanning enables valid updates.
* **P0 Flow**:

  * Create order → Generate QR → Print & attach → Scan on factory floor → Update backend

#### 3. **Bulk QR Status Update**

* **Description**: Efficiently scan and update status for multiple orders.
* **Acceptance Criteria**:

  * Scan session supports multiple entries.
  * Batch update persists without data loss.
* **P0 Flow**:

  * Bulk scan → Confirm order list → Apply status "Ready for Pickup" → Confirm on dashboard

#### 4. **Inventory Management**

* **Description**: Monitor and edit product stock levels.
* **Acceptance Criteria**:

  * Orders deduct correct stock values.
  * Alerts trigger below threshold.
* **P0 Flow**:

  * Order placed → Inventory reduced → Threshold breached → Notification generated

#### 5. **Notifications System**

* **Description**: Send real-time messages on key events.
* **Acceptance Criteria**:

  * Templates editable from UI.
  * Customer receives accurate info.
* **P0 Flow**:

  * Order marked "Shipped" → Email & WhatsApp sent → Verify content and delivery

#### 6. **Reports & Analytics**

* **Description**: Visualize metrics and export summaries.
* **Acceptance Criteria**:

  * Graphs reflect real-time backend data.
  * CSV/PDF download includes all fields.
* **P0 Flow**:

  * Open Reports → Apply date range → View totals → Export file → Validate accuracy

---

**Part 2: Engineering Document (For Development Team)**

**Tech Stack**

* Backend: Java Spring Boot
* Database: MongoDB
* Frontend: React/Next.js
* Event System: Apache Kafka
* Payment Gateway: Stripe

---

### **Microservices Architecture and Implementation Details**

#### 1. **Order Service**

* Exposes REST API to place and fetch orders
* Manages Stripe integration for payments
* Publishes Kafka events on create/update

#### 2. **Inventory Service**

* REST endpoints for CRUD operations
* Consumes order events to auto-update stock
* Publishes `inventory.low` topic

#### 3. **Notification Service**

* Kafka consumer for order-related topics
* Integrates SMTP (email) and Twilio (WhatsApp)

#### 4. **QR Code Generator**

* Uses ZXing Java library
* Saves PNGs/URLs per order
* React scanner component built using `react-qr-scanner`

#### 5. **WebSocket/Real-Time Service**

* Uses STOMP over WebSocket
* Spring-based endpoint: `/topic/order/{orderId}`
* React subscribes using `@stomp/stompjs`

---

### **Database Models**

* `Order`: ID, items, QR, status, customer ref, timestamps
* `Product`: SKU, stock, price, category
* `Customer`: name, phone, address, history
* `NotificationLog`: event, medium, sent\_at

---

### **Kafka Topics**

* `order.created`
* `order.status.updated`
* `inventory.low`

---

### **Engineering Prompts (Copy-Ready)**

**Order API**
"Build a secure POST endpoint in Spring Boot for placing orders. Validate inventory, generate order ID, connect with Stripe, store in MongoDB, emit `order.created` to Kafka."

**QR Code Handling**
"Use ZXing to generate PNG from UUID. Return link via REST. Build a scanner input on React frontend that POSTs to `/order/update-status`."

**Live Order Tracking**
"Implement WebSocket endpoint using STOMP. Emit events on order status change to `/topic/order/{id}`. Frontend subscribes and updates UI."

**Bulk QR Status Update**
"Create a React interface to scan multiple QR codes. Submit list to backend via POST. Backend endpoint updates status in batch and returns summary."

**Inventory Watcher**
"Create Kafka listener on `order.created`. Deduct quantity in MongoDB. If stock below min, emit `inventory.low` topic."

**Customer Notification**
"On `order.status.updated`, send transactional email with Thymeleaf + SMTP and WhatsApp using Twilio template. Log events in Mongo."

---

This document now fully reflects all platform objectives, user stories, engineering responsibilities, test coverage, and AI prompt-readiness for automated tooling.


Feature: Payment Processing Integration

Goal: Securely integrate a payment gateway (e.g., Stripe) to charge customers at checkout and ensure orders are only created when payment is confirmed.

Requirements:
- **Payment Gateway Setup**:
  - Use Stripe’s Java SDK. Configure API keys (test and live) in application config.
  - Ensure HTTP endpoints are HTTPS (for sending any sensitive info).
- **Checkout Process**:
  - Option 1 (Direct Charge): Accept payment details via the Order API request. Use the Stripe SDK to create a Charge:
    - Create a Charge with amount (in cents), currency, and payment source (token or card info).
    - If Charge is successful (no exception, status = succeeded), proceed with order creation.
    - If Charge is declined or fails, return an error response to the client (do not create order).
  - Option 2 (PaymentIntent Workflow): 
    - Provide an endpoint `POST /api/payments/create-intent` that the frontend calls with order amount.
    - On this call, use Stripe to create a PaymentIntent (with amount, currency, description).
    - Return the PaymentIntent client secret to the frontend.
    - The frontend uses Stripe.js to handle card input and confirm the PaymentIntent.
    - Implement a webhook endpoint `/api/payments/webhook` to listen for PaymentIntent success event from Stripe.
    - When webhook receives confirmation, it triggers creation or update of the order in the database (marking it paid).
- **Order Creation Synchronization**:
  - If using direct charge (synchronous), encapsulate payment and order DB save in one flow:
    - Possibly use a distributed transaction or ensure that if payment succeeds and a system crash happens before saving order, you handle that (maybe via webhook or manual reconciliation).
  - If using PaymentIntent + webhook (async), you may create an Order in “Pending Payment” status when checkout is initiated, then update to “Confirmed” on webhook confirmation.
  - Alternatively, create order only after payment confirmation to avoid unpaid orders.
- **Error Handling**:
  - Use Stripe’s idempotency keys if needed to avoid double charges if the API call is retried.
  - Gracefully handle exceptions from Stripe API (network issues, invalid card, etc.) and translate them to user-friendly messages (card declined, etc.).
- **Security**:
  - Never store full card details. If needed, store Stripe’s payment method ID or charge ID for reference.
  - Protect the payment endpoints with authentication (only logged-in users can create a PaymentIntent or charge for their order).
  - Validate that the amount charged matches the order amount calculated on server to prevent tampering.
- **Testing**:
  - In test mode, simulate a successful payment: verify order is saved with status “Confirmed/Paid”.
  - Simulate a failed payment (use Stripe test card for decline): verify no order created (or order marked failed) and error is returned.
  - Simulate webhook (you can manually call the webhook endpoint with sample event JSON from Stripe) to ensure it updates order status appropriately.
- **Extensibility**:
  - Design the Payment integration code as a service/class that could be swapped if you switch gateways (abstract the payment processing).
  - Later, could expand to support multiple payment methods (cards, PayPal, etc.) by adding additional logic or services.

Feature: Notification Service (Emails and SMS)

Goal: Build a service that listens for order events and sends notification messages (email/SMS) to customers (or admins) accordingly.

Requirements:
- **Event Consumption**: Use Spring Kafka (or Spring Cloud Stream) in a Notification Service application to subscribe to relevant topics:
  - Subscribe to the `order.created` event topic for new orders.
  - Subscribe to the `order.status.updated` events.
- **Order Confirmation Email**:
  - On receiving an `order.created` event, compose an email to the customer to confirm the order.
  - Email should include order number, summary of items, total paid, and an estimated delivery or next steps info.
  - Use the customer’s email from the event data. If not present, the service may call an Order API to fetch details (avoid if possible by including needed data in the event).
  - Send the email via SMTP. Use Spring’s JavaMailSender configured with our SMTP credentials (e.g., a SendGrid API SMTP or similar).
  - Use an HTML template for the email body (Thymeleaf or Freemarker template files) to produce a nice-looking receipt.
- **Status Update Notifications**:
  - On `order.status.updated` events, check the new status field.
  - If status == “Shipped”: 
    - Fetch shipping details (tracking number, courier) if included in event or via API call to Order Service.
    - Send a shipment notification email to the customer: include tracking link/number and items shipped.
    - (Optional) If the customer has a phone number and opted in, also send an SMS with a short message (“Your order 12345 has shipped! Track: ...”).
  - If status == “Delivered”:
    - Send a delivery confirmation email (and optionally SMS: “Your order 12345 was delivered. Thank you!”).
  - If status == “Cancelled”:
    - Send a cancellation email with details (refund process etc., if applicable).
  - Other statuses (e.g., intermediate production steps) might not send emails by default.
- **SMS Integration (Optional)**:
  - Integrate with an SMS gateway (e.g., Twilio). Use their Java SDK or REST API to send text messages.
  - Only send SMS for critical updates (shipped, delivered, problems), and only if the event/customer data indicates to do so (you might add a flag “notifySms”).
- **Error Handling & Logging**:
  - If an email fails to send (exception from SMTP), log the error with orderId and error message. The service can retry a few times or put it into a dead-letter queue (for manual retry) if needed.
  - Maintain an optional log of notifications sent (could be a MongoDB collection or even just logs for now).
- **Configuration**:
  - Email server settings (SMTP host, port, user/pass) should be externalized (application.properties or env variables).
  - SMS API credentials likewise.
- **Testing**:
  - Write unit tests for the event listener methods (e.g., feed a sample `order.created` event object and verify that MailSender.send was called with correct parameters – use a mock MailSender).
  - Use a test SMTP server in dev to actually capture emails.
  - Simulate different status events to ensure only intended ones trigger messages.


Feature: Real-Time Order Tracking (WebSocket)

Goal: Implement server‑push notifications so that customers can see order status updates in real time on the tracking page.

Requirements:
- **WebSocket Endpoint (Server)**: Configure a WebSocket endpoint on the Spring Boot backend (Order Service).
  - Use Spring WebSocket (Spring Messaging with STOMP). For example, enable a STOMP endpoint at `/ws` and allow SockJS fallback.
  - Configure a simple message broker (e.g., in-memory or use the enableSimpleBroker for “/topic” destinations).
  - Configure application destination prefix “/app” for messages sent from client to server (if needed, though our use-case is mostly server-to-client).
- **Server-Side Message Sending**:
  - When an order’s status changes (in the Order update logic), send a WebSocket message to subscribers.
  - For instance, if using a public topic: `convertAndSend("/topic/order/" + orderId, { orderId, newStatus, timestamp })`.
  - If using user-specific messaging: after identifying which user owns the order, use `convertAndSendToUser(userId, "/queue/order-updates", {...})`.
  - The payload can be a small JSON with the orderId and updated status (or the entire order object).
- **Client Subscription (Frontend)**:
  - In the React customer app, establish a WebSocket connection when the order tracking page loads.
  - Use a STOMP JS client (such as @stomp/stompjs). Connect to the `/ws` endpoint (e.g., `wss://yourdomain/ws`).
  - After connecting, subscribe to the relevant topic:
    - If public topic per order: subscribe to `/topic/order/{orderId}`.
    - If user-specific: subscribe to something like `/user/queue/order-updates` and have the server filter by orderId in the message payload.
  - Handle incoming messages: On message, update the application state to reflect the new status. For example, push a new status entry into the order’s status timeline.
- **Security**:
  - Ensure the WebSocket connection is established with user authentication. Use JWT token during the handshake (e.g., include it in the WebSocket connect URL or headers).
  - If using `convertAndSendToUser`, the Spring security context will ensure messages go to the correct authenticated user.
  - Validate on the server side that the subscriber is allowed to subscribe to that order’s topic (especially important if not using user-specific destinations). Alternatively, design topics to inherently segregate users (like include userId).
- **Testing**:
  - Simulate an order status change (via admin action or a test endpoint) while a client is viewing the tracking page. Verify that the client receives the WebSocket message and updates the UI without a page refresh.
  - Test with multiple clients subscribed to different orders to ensure messages don’t leak between orders/users.
- **Tech Notes**:
  - Use `SimpMessagingTemplate` in Spring to broadcast messages from service layer.
  - In React, manage the WebSocket client’s lifecycle (connect on component mount, disconnect on unmount).
  - Consider using SockJS for compatibility, and heartbeat/keepalive settings to maintain the connection.
  - Provide fallback (like periodic AJAX polling) if WebSocket fails, to ensure the user eventually sees updates.

Feature: QR Code Generation and Scanning (Order Tracking)

Goal: Enable the system to tag each order with a QR code and allow admin users to scan these codes to update order status quickly.

Requirements:
- **QR Code Generation (Backend)**:
  - After creating a new order (in the Order Service), generate a QR code representing that order. Use a Java library like ZXing to create a QR code image encoding the order ID or a URL.
  - Save the QR code image to a file (e.g., `qr-codes/{orderId}.png`) or as binary data in MongoDB. Store the reference (file path or binary) in the Order record.
  - Provide an endpoint `GET /api/orders/{orderId}/qr` to retrieve the QR code image for an order (for printing or display). Only admins can access this.
- **Admin Portal Scanning (Frontend)**:
  - Implement a scanning component in the admin React app that uses the device camera to scan QR codes. You can use **react-qr-scanner** or similar.
  - When a QR code is detected, parse the order ID from it. Then automatically call the backend:
    - Option 1: Fetch order details via `GET /api/orders/{orderId}` and display them to the admin for confirmation.
    - Option 2: If the admin has pre-selected an action (like “Mark as Shipped”), directly call `PUT /api/orders/{orderId}/status` with the new status.
  - Provide a UI for **bulk scanning mode**:
    - Admin selects a status (or action) to apply.
    - Admin scans multiple order QR codes in succession. For each scan, call the update API and show a quick confirmation (e.g., flash the order ID and “updated” on screen).
    - After processing, perhaps show a summary (e.g., 10 orders marked as Shipped).
- **Status Update Handling (Backend)**:
  - The Order update endpoint should handle rapid successive calls. Use MongoDB’s capabilities to update quickly by ID, and ensure each update triggers its own event and notification.
  - Consider idempotency: scanning the same code twice for the same status should not duplicate actions (the second update could return a no-op or warning).
- **Tech Notes**:
  - Use the MediaDevices API (`navigator.mediaDevices.getUserMedia`) in the browser to access the camera (ensure site is HTTPS).
  - The scanning library should continuously scan frames for a QR pattern; once detected, you may want to pause/stop the camera briefly to avoid duplicate reads (then resume after processing).
  - Ensure proper error handling in the UI (e.g., if camera not available or permission denied, inform the user).
  - In the backend, ZXing usage: generate a BitMatrix from the order URL or text, use MatrixToImageWriter to get a BufferedImage, and ImageIO to write PNG to a file stream.



Feature: Order Management (Backend)

Goal: Implement the Order Service in Spring Boot to handle order placement, payment, and status tracking for the embroidered clothing platform.

Scope & Requirements:
- **New Order API**: Create a REST endpoint `POST /api/orders` that accepts order details (customer info, list of items with product IDs and customizations, shipping address, payment token/details).
  - Validate the request and calculate the total price (retrieve product prices, apply any customization cost).
  - Integrate with a payment gateway (e.g. Stripe) to charge the customer. Use the Stripe Java SDK to create a charge or confirm a payment intent. Handle payment success or failure.
  - On payment success, generate a unique order ID (UUID) and create an Order record in MongoDB (use Spring Data MongoDB). Set initial status to “Order Placed” or “Confirmed”.
  - Generate a QR code for the order (using a library like ZXing). The QR code should encode the order’s ID or tracking URL. Save the QR code image to a file or as binary data, and store the reference in the Order.
  - Produce an `order.created` event to Kafka (use Spring Kafka). The event should include orderId, items (IDs and quantities), and customer contact info, so other services (Inventory, Notification) can react.
  - Respond with order confirmation data: orderId, status, and maybe the QR code data or a URL to it.
- **Get Order API**: Create `GET /api/orders/{orderId}` to retrieve order details and status. 
  - This endpoint should be secured: customers can only fetch their own orders (validate using JWT or session user ID vs order’s customer ID). Admins can fetch any order.
  - The response JSON should include order info (items, current status, history of status changes if available, and QR code link if admin).
- **Update Status API**: Create `PUT /api/orders/{orderId}/status` for admins to update an order’s status.
  - Accept a new status (e.g. “Embroidery Complete”, “Shipped”) in the request body or derived from an action.
  - Update the Order in MongoDB: set the new status and append to status history with timestamp.
  - Produce an `order.status.updated` event to Kafka with orderId and new status.
  - (Optional) If certain status triggers immediate actions, handle them. E.g., on “Cancelled”, maybe call Inventory Service to release stock (or emit an event).
  - Respond with the updated order or status confirmation.
- **Tech Notes**:
  - Use Spring Boot with Spring Web for REST controllers.
  - Use Spring Data MongoDB repositories for data access (e.g., OrderRepository).
  - Use Bean Validation for request DTOs (ensuring required fields).
  - Utilize Spring’s `RestTemplate` or Stripe SDK for the external payment call.
  - For Kafka, use Spring Cloud Stream or Spring Kafka to publish events (`order.created`, `order.status.updated`) to topics (like “orders” topic, with different event types or separate topics per type).
  - Ensure methods are transactional where appropriate (although MongoDB ops and external calls will be handled carefully to avoid partial failures).

please add detailed readme and comments in the code bases, Please ask few you need any deatils
