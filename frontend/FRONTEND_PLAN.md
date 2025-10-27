# Banking Catalogue App - Technical Implementation Plan

## Tech Stack

- React 19 + TypeScript
- Vite build tool
- Tailwind CSS v4
- Shadcn/ui components
- React Router DOM v7
- React Hook Form + Zod validation
- TanStack Query for API management
- Axios for HTTP requests

## Pages & Implementation Plan

### 1. Authentication Page (`/auth`)

**Components:**

- `LoginForm` - Customer ID or mobile input with validation
- `OTPVerification` - OTP input using shadcn `input-otp`
- `AuthLayout` - Kiosk-friendly centered layout

**Utils/Services:**

- `authService.ts` - Login, OTP generation/verification APIs
- `validateCustomerInput.ts` - Input validation utilities

**API Endpoints:**

- `POST /auth/login` - Customer ID/mobile login
- `POST /auth/verify-otp` - OTP verification
- `GET /auth/customer/{id}` - Customer details

### 2. Dashboard/Landing Page (`/dashboard`)

**Components:**

- `DashboardLayout` - Main layout with header and content area
- `LastVisitWidget` - Shows last bank visit info
- `RecentTransactionsWidget` - Transaction history table
- `UpcomingBillsWidget` - Bills and payment reminders
- `ProductCatalogueWidget` - Bank products showcase
- `RecommendedProduct` - Highlighted/ranked product card

**Utils:**

- `formatCurrency.ts` - Currency formatting
- `formatDate.ts` - Date formatting utilities
- `calculateRecommendations.ts` - Product ranking logic

**API Endpoints:**

- `GET /customer/{id}/dashboard` - Dashboard data
- `GET /customer/{id}/transactions` - Recent transactions
- `GET /customer/{id}/bills` - Upcoming bills
- `GET /products/catalogue` - Available bank products
- `GET /customer/{id}/recommendations` - AI-recommended products

### 3. Product Details Page (`/products/:id`)

**Components:**

- `ProductDetailsLayout` - Product showcase layout
- `ProductInfo` - Detailed product information
- `ProductFeatures` - Feature highlights
- `ProductCalculator` - Interest/EMI calculator
- `ContactAgent` - Agent contact form

**Utils:**

- `calculateEMI.ts` - EMI calculation utilities
- `productHelpers.ts` - Product-specific utilities

**API Endpoints:**

- `GET /products/{id}` - Product details
- `POST /agent/contact` - Contact agent request

## Shared Components & Infrastructure

### Core Layout Components

- `KioskLayout` - Main app layout optimized for kiosk screens
- `Header` - App header with customer info and logout
- `NavigationBreadcrumb` - Navigation breadcrumbs
- `LoadingSpinner` - Loading states
- `ErrorBoundary` - Error handling

### Common UI Components

- `CustomerInfoCard` - Customer details display
- `TransactionRow` - Individual transaction item
- `ProductCard` - Product display card
- `BillReminder` - Bill notification component
- `RankingBadge` - Product ranking indicator

### Shared Services

- `apiClient.ts` - Axios instance with interceptors
- `errorHandler.ts` - Global error handling
- `sessionManager.ts` - Session timeout management
- `logger.ts` - Logging service for kiosk monitoring

### Types & Interfaces

- `Customer.ts` - Customer data types
- `Transaction.ts` - Transaction types
- `Product.ts` - Product catalogue types
- `Bill.ts` - Bill reminder types
- `Agent.ts` - Agent assessment types

### Hooks

- `useAuth.ts` - Authentication state management
- `useCustomerData.ts` - Customer data fetching
- `useSessionTimeout.ts` - Auto-logout functionality
- `useKioskMode.ts` - Kiosk-specific behaviors

### Utils

- `constants.ts` - App constants and configurations
- `storage.ts` - Local storage management
- `validation.ts` - Form validation schemas
- `permissions.ts` - Customer permission checks

## Implementation Phases

### Phase 1: Foundation

- Set up routing with React Router
- Implement authentication flow
- Create base layouts and components
- Set up API client and error handling

### Phase 2: Dashboard

- Build dashboard layout and widgets
- Implement customer data fetching
- Create transaction and bill displays
- Add product catalogue integration

### Phase 3: Product Features

- Implement product details page
- Add recommendation system integration
- Build agent assessment features
- Create product ranking logic

### Phase 4: Kiosk Optimization

- Add session timeout management
- Implement accessibility features
- Optimize for touch interactions
- Add error recovery mechanisms

### Phase 5: Polish & Security

- Implement comprehensive error handling
- Add security measures for kiosk environment
- Performance optimization
- Testing and quality assurance

## Key Considerations

- Kiosk-optimized UI (large touch targets, clear navigation)
- Auto-logout after inactivity
- Offline state handling
- Error recovery for network issues
- Accessibility compliance
- Security for public kiosk usage
