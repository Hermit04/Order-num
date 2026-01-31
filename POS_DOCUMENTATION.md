# POS System Documentation

## Overview

This is a comprehensive Point of Sale (POS) system designed for small stores with inventory management, barcode scanning, sales tracking, reporting, and multi-store support with subscription management.

## Features

### 1. Multi-Store Management
- Create and manage multiple store locations
- Subscription tiers: Free, Basic, Premium
- Store status tracking (Active, Inactive, Suspended)
- Owner assignment and contact management

### 2. Inventory Management
- Product catalog with barcode support
- Category organization
- Stock level tracking
- Low stock alerts
- SKU and barcode management
- Price and cost tracking
- Min quantity thresholds

### 3. Point of Sale (POS)
- Fast product search
- Barcode scanning support
- Shopping cart management
- Multiple payment methods (Cash, Card, Mobile, Other)
- Real-time inventory updates
- Transaction numbering
- Tax calculation (10%)

### 4. Sales & Transactions
- Complete sales history
- Transaction details with line items
- Refund processing
- Payment method tracking
- Sales statistics

### 5. Reports & Analytics
- Revenue tracking (7, 30, 90 day periods)
- Transaction counts and averages
- Product performance
- Inventory status reports
- Sales history with filters

### 6. User & Role Management
- Role-based access: Admin, Store Owner, Cashier, Manager
- Per-store user assignment
- User status management

### 7. Dashboard
- Quick statistics overview
- Recent sales
- Low stock alerts
- Quick access to all features

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TanStack Start** - SSR framework with routing
- **TailwindCSS** - Styling
- **shadcn/ui** - UI components
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Convex** - Reactive backend-as-a-service
- **Better Auth** - Authentication
- **TypeScript** - Type safety

### Build System
- **Turborepo** - Monorepo management
- **Vite** - Build tool
- **Bun** - Package manager

## Project Structure

```
Order-num/
├── apps/
│   └── web/                    # Frontend application
│       ├── src/
│       │   ├── components/     # UI components
│       │   │   ├── ui/        # shadcn/ui components
│       │   │   ├── header.tsx
│       │   │   ├── sign-in-form.tsx
│       │   │   └── sign-up-form.tsx
│       │   ├── routes/        # Application routes
│       │   │   ├── dashboard.tsx   # Main dashboard
│       │   │   ├── stores.tsx      # Store management
│       │   │   ├── inventory.tsx   # Inventory management
│       │   │   ├── pos.tsx         # Point of Sale
│       │   │   ├── reports.tsx     # Reports & analytics
│       │   │   └── index.tsx       # Home page
│       │   └── lib/           # Utilities
├── packages/
│   └── backend/               # Convex backend
│       └── convex/
│           ├── schema.ts      # Database schema
│           ├── stores.ts      # Store operations
│           ├── products.ts    # Product/inventory operations
│           ├── categories.ts  # Category operations
│           ├── sales.ts       # Sales operations
│           ├── users.ts       # User operations
│           └── auth.ts        # Authentication
```

## Database Schema

### Stores
- Store details (name, email, phone, address)
- Owner assignment
- Subscription information (type, status, expiry)
- Timestamps

### Products
- Product information (name, description, SKU, barcode)
- Pricing (price, cost)
- Inventory (quantity, min quantity, unit)
- Category assignment
- Store association
- Active status

### Categories
- Category details (name, description)
- Store association

### Sales
- Sale number (auto-generated)
- Line items (products, quantities, prices)
- Totals (subtotal, tax, discount, total)
- Payment information
- Status (completed, refunded, cancelled)
- Cashier tracking

### Users
- User details (name, email)
- Role (admin, store_owner, cashier, manager)
- Store assignment
- Active status

### Barcode Scans
- Scan tracking
- Product association
- Success status
- Timestamps

## Key Pages

### 1. Dashboard (`/dashboard`)
- Quick statistics cards (stores, revenue, transactions, average sale)
- Quick action cards linking to main features
- Recent sales list
- Low stock alerts

### 2. Store Management (`/stores`)
- List all stores with details
- Create new stores with subscription
- Update store information
- Delete stores
- Subscription status badges

### 3. Inventory Management (`/inventory`)
- Product listing with stock levels
- Add new products with barcode
- Update product details
- Low stock alerts
- Multi-store switching

### 4. Point of Sale (`/pos`)
- Product search
- Barcode input
- Shopping cart with quantity controls
- Payment method selection
- Real-time total calculation
- Complete sale button

### 5. Reports & Analytics (`/reports`)
- Time period selection (7, 30, 90 days)
- Revenue statistics
- Transaction counts
- Sales history table
- Product performance tab
- Inventory status

## User Roles

### Admin
- Full system access
- Create and manage stores
- Manage subscriptions
- View all data across stores

### Store Owner
- Manage their store(s)
- Access all features for owned stores
- Manage store users
- View reports for owned stores

### Manager
- Manage inventory
- Process sales
- View reports
- Cannot modify store settings

### Cashier
- Process sales (POS)
- View products
- Limited access to reports

## Features Implementation

### Barcode Scanning
The system supports barcode scanning through:
1. Manual barcode input field in POS
2. Automatic product lookup on barcode entry
3. Add to cart on successful match
4. Barcode scan logging for analytics

### Subscription Management
Three subscription tiers:
- **Free**: Basic features
- **Basic**: Enhanced features
- **Premium**: Full features

Subscription expiry tracking with 30-day default period.

### Low Stock Alerts
- Automatic detection when `quantity <= minQuantity`
- Dashboard alerts
- Inventory page highlighting
- Visual badges for quick identification

### Payment Processing
Supports multiple payment methods:
- Cash
- Credit/Debit Card
- Mobile Payment
- Other

## Getting Started

### Prerequisites
- Bun 1.3.8 or later
- Node.js 20+ (for compatibility)
- Convex account

### Installation

1. Install dependencies:
```bash
bun install
```

2. Set up Convex:
```bash
bun run dev:setup
```

3. Copy environment variables:
```bash
# Copy from packages/backend/.env.local to apps/*/.env
```

4. Start development server:
```bash
bun run dev
```

5. Access the application:
- Web: http://localhost:3001

### Building for Production

```bash
bun run build
```

## Usage Guide

### Creating a Store (Admin)
1. Navigate to `/stores`
2. Click "Create Store"
3. Fill in store details:
   - Name
   - Owner ID
   - Email
   - Phone (optional)
   - Address (optional)
   - Subscription type
4. Click "Create"

### Adding Products
1. Navigate to `/inventory`
2. Select a store
3. Click "Add Product"
4. Fill in product details:
   - Name
   - SKU
   - Barcode (optional)
   - Price
   - Cost
   - Quantity
   - Min Quantity
5. Click "Add Product"

### Processing a Sale
1. Navigate to `/pos`
2. Select a store
3. Search for products or scan barcode
4. Click products to add to cart
5. Adjust quantities as needed
6. Select payment method
7. Click "Complete Sale"

### Viewing Reports
1. Navigate to `/reports`
2. Select a store
3. Choose time period (7, 30, or 90 days)
4. View statistics and sales history
5. Switch to "Product Performance" tab for inventory

## Design Philosophy

### User-Friendly
- Clear navigation with icons
- Intuitive workflows
- Minimal clicks to complete tasks
- Responsive feedback with toasts

### Aesthetic
- Modern, clean design
- Consistent color scheme
- Professional appearance
- Card-based layouts

### Efficient
- Fast product search
- Quick cart management
- Real-time updates
- Optimized queries

## Future Enhancements

Potential features for future development:
- Receipt printing
- Email receipts
- Advanced analytics with charts
- Employee time tracking
- Customer loyalty program
- Multi-currency support
- Invoice generation
- Purchase orders
- Supplier management
- Export reports to CSV/PDF
- Mobile app version
- Offline mode support

## License

This project is part of the Order-num system.
