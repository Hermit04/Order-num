# POS System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         POS System                               │
│                    (Order-num Platform)                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼────────┐              ┌──────▼────────┐
        │   Frontend     │              │    Backend    │
        │   (React)      │◄────────────►│   (Convex)    │
        └────────────────┘              └───────────────┘
```

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Application                          │
│                  (TanStack Start + React)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Routes    │  │  Components  │  │     Lib      │      │
│  │              │  │              │  │              │      │
│  │ • /          │  │ • Header     │  │ • auth       │      │
│  │ • /dashboard │  │ • Forms      │  │ • utils      │      │
│  │ • /stores    │  │ • UI (shadcn)│  │              │      │
│  │ • /inventory │  │   - Table    │  │              │      │
│  │ • /pos       │  │   - Dialog   │  │              │      │
│  │ • /reports   │  │   - Select   │  │              │      │
│  │              │  │   - Badge    │  │              │      │
│  │              │  │   - Tabs     │  │              │      │
│  │              │  │   - Card     │  │              │      │
│  │              │  │   - Button   │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Convex Backend                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Schema     │  │  Functions   │  │     Auth     │      │
│  │              │  │              │  │              │      │
│  │ • stores     │  │ • stores     │  │ • Better-Auth│      │
│  │ • products   │  │ • products   │  │ • Email/Pass │      │
│  │ • categories │  │ • categories │  │ • Sessions   │      │
│  │ • sales      │  │ • sales      │  │              │      │
│  │ • users      │  │ • users      │  │              │      │
│  │ • barcodes   │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Authentication Flow
```
User → Sign In/Up Form → Better Auth → Convex Auth → Session Token → Protected Routes
```

### Store Creation Flow (Admin)
```
Admin → Stores Page → Create Dialog → Form Submit
  → stores.create() → Convex DB → Success Toast → Refresh List
```

### Product Management Flow
```
User → Inventory Page → Select Store → Add Product Dialog
  → Form Submit → products.create() → Convex DB
  → Update Inventory List → Low Stock Check → Alerts
```

### POS Transaction Flow
```
Cashier → POS Page → Search/Scan Product → Add to Cart
  → Adjust Quantity → Select Payment → Complete Sale
  → sales.create() → Update Inventory → Generate Sale Number
  → Success Toast → Clear Cart
```

### Reporting Flow
```
User → Reports Page → Select Store → Choose Period
  → sales.getStats() + sales.listByStore() → Convex DB
  → Calculate Metrics → Display Charts/Tables
```

## Database Schema Relationships

```
┌──────────┐         ┌──────────┐
│  Stores  │◄───────┤  Users   │
│          │  owner  │          │
└────┬─────┘         └──────────┘
     │
     │ 1:N
     │
     ├─────────────┐
     │             │
     ▼             ▼
┌──────────┐  ┌──────────┐
│ Products │  │  Sales   │
│          │  │          │
└────┬─────┘  └────┬─────┘
     │             │
     │ N:1         │ N:M
     │             │
     ▼             ▼
┌──────────┐  ┌──────────┐
│Categories│  │SaleItems │
│          │  │          │
└──────────┘  └──────────┘
```

## Component Hierarchy

```
App (Root)
│
├── Header
│   ├── Logo
│   ├── Navigation Links
│   └── User Menu
│
└── Routes
    ├── Home (/)
    │   └── API Status + Welcome
    │
    ├── Dashboard (/dashboard)
    │   ├── Stats Cards (4x)
    │   ├── Quick Actions (4x)
    │   ├── Recent Sales
    │   └── Low Stock Alerts
    │
    ├── Stores (/stores)
    │   ├── Create Dialog
    │   │   └── Form Fields
    │   └── Stores Table
    │       └── Action Buttons
    │
    ├── Inventory (/inventory)
    │   ├── Store Selector
    │   ├── Add Product Dialog
    │   │   └── Form Fields
    │   ├── Low Stock Alert Card
    │   └── Products Table
    │       └── Action Buttons
    │
    ├── POS (/pos)
    │   ├── Store Selector
    │   ├── Products Panel
    │   │   ├── Search Input
    │   │   ├── Barcode Input
    │   │   └── Product List
    │   └── Cart Panel
    │       ├── Cart Items
    │       ├── Totals
    │       ├── Payment Select
    │       └── Checkout Button
    │
    └── Reports (/reports)
        ├── Store Selector
        ├── Period Selector
        ├── Stats Cards (4x)
        └── Tabs
            ├── Sales History
            │   └── Sales Table
            └── Product Performance
                └── Products Table
```

## Technology Stack Details

### Frontend Stack
```
React 19.2.3
  └── TanStack Start 1.141.1
      ├── TanStack Router (routing)
      ├── TanStack Query (data fetching)
      └── TanStack Form (form handling)

Styling
  └── TailwindCSS 4.1.3
      └── shadcn/ui components

Icons
  └── Lucide React

Notifications
  └── Sonner (toast)

Auth Client
  └── Better Auth 1.4.9
```

### Backend Stack
```
Convex 1.31.2
  ├── Database (NoSQL)
  ├── Functions (TypeScript)
  └── Real-time Subscriptions

Auth
  └── Better Auth + Convex Plugin
      ├── Email/Password
      └── Session Management

TypeScript 5.9.3
  └── Type Safety
```

### Build Tools
```
Turborepo 2.8.1
  └── Monorepo Management

Vite 7.3.1
  └── Build Tool
      ├── Fast HMR
      └── Optimized Builds

Bun 1.3.8
  └── Package Manager + Runtime
```

## Security Features

1. **Authentication**: Better Auth with JWT tokens
2. **Authorization**: Role-based access control (Admin, Owner, Cashier, Manager)
3. **Data Validation**: Zod schemas for input validation
4. **Type Safety**: Full TypeScript coverage
5. **Secure Sessions**: Server-side session management

## Performance Optimizations

1. **Code Splitting**: Route-based lazy loading
2. **Real-time Updates**: Convex subscriptions for live data
3. **Optimistic Updates**: Instant UI feedback
4. **Caching**: React Query for data caching
5. **Build Optimization**: Vite production builds

## Scalability Considerations

1. **Multi-Store Support**: Store isolation in data model
2. **Subscription Tiers**: Flexible pricing model
3. **Role Hierarchy**: Extensible user roles
4. **Modular Backend**: Easy to add new functions
5. **Component Reusability**: shadcn/ui components

## Deployment Architecture

```
┌──────────────────────────────────────────────┐
│            Production Environment             │
├──────────────────────────────────────────────┤
│                                               │
│  Frontend (Vercel/Netlify)                   │
│  ├── Static Assets (CDN)                     │
│  ├── SSR Pages                               │
│  └── Client Hydration                        │
│                                               │
│  Backend (Convex Cloud)                      │
│  ├── Serverless Functions                    │
│  ├── Database (Managed)                      │
│  ├── Real-time Subscriptions                 │
│  └── Authentication                           │
│                                               │
└──────────────────────────────────────────────┘
```

## Key Design Patterns

1. **Component Composition**: Reusable UI components
2. **State Management**: React Context + Convex Queries
3. **Data Fetching**: React Query with Convex
4. **Form Handling**: Controlled components
5. **Error Handling**: Try-catch with toast notifications
6. **Loading States**: Skeleton loaders and spinners

## API Endpoints (Convex Functions)

### Stores
- `stores.create` - Create new store
- `stores.list` - List all stores
- `stores.get` - Get store by ID
- `stores.update` - Update store
- `stores.remove` - Delete store
- `stores.getByOwner` - Get stores by owner

### Products
- `products.create` - Create product
- `products.listByStore` - List products by store
- `products.get` - Get product by ID
- `products.findByBarcode` - Find product by barcode
- `products.update` - Update product
- `products.updateQuantity` - Update stock quantity
- `products.remove` - Delete product
- `products.getLowStock` - Get low stock products

### Categories
- `categories.create` - Create category
- `categories.listByStore` - List categories by store
- `categories.update` - Update category
- `categories.remove` - Delete category

### Sales
- `sales.create` - Create sale
- `sales.listByStore` - List sales by store
- `sales.get` - Get sale by ID
- `sales.getByDateRange` - Get sales by date range
- `sales.refund` - Refund a sale
- `sales.getStats` - Get sales statistics

### Users
- `users.create` - Create user
- `users.list` - List all users
- `users.listByStore` - List users by store
- `users.getByUserId` - Get user by auth ID
- `users.update` - Update user
- `users.remove` - Delete user

### Auth
- `auth.getCurrentUser` - Get current authenticated user
