# Order-num

A comprehensive Point of Sale (POS) system for small stores with inventory management, barcode scanning, sales tracking, and multi-store support.

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Start, Convex, and more.

## Features

### Core POS Features
- **Multi-Store Management** - Admin can create and manage multiple stores with subscription tiers
- **Inventory Management** - Products with barcodes, categories, stock tracking, and low stock alerts
- **Point of Sale** - Fast checkout with cart management and multiple payment methods
- **Barcode Scanning** - Product lookup and tracking
- **Reports & Analytics** - Revenue tracking, sales history, and product performance
- **User & Role Management** - Admin, Store Owner, Cashier, and Manager roles
- **Modern UI** - White and orange theme with aesthetic, user-friendly design

### Technical Stack
- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Convex** - Reactive backend-as-a-service platform
- **Better-Auth** - Authentication system
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Convex Setup

This project uses Convex as a backend. You'll need to set up Convex before running the app:

```bash
bun run dev:setup
```

Follow the prompts to create a new Convex project and connect it to your application.

Copy environment variables from `packages/backend/.env.local` to `apps/*/.env`.

## Seed Sample Data (Optional)

To quickly get started with sample data, you can run the seed function:

```bash
# From the Convex dashboard or CLI
npx convex run seed:seedData
```

This will create:
- Admin user and store owner accounts
- A sample store "Orange Grove Market"
- 5 product categories
- 12 sample products
- 5 sales transactions
- See [SEED_GUIDE.md](SEED_GUIDE.md) for details

## Run Development Server

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
Your app will connect to the Convex cloud backend automatically.

## Project Structure

```
Order-num/
├── apps/
│   ├── web/              # Frontend application (React + TanStack Start)
│   │   ├── src/routes/   # Application pages (Dashboard, POS, Inventory, etc.)
│   │   └── src/components/ # UI components
├── packages/
│   ├── backend/          # Convex backend functions and schema
│   │   └── convex/       # Database schema and API functions
│       ├── schema.ts     # Database tables
│       ├── seed.ts       # Sample data generator
│       ├── stores.ts     # Store management
│       ├── products.ts   # Inventory operations
│       └── sales.ts      # Transaction processing
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run dev:setup`: Setup and configure your Convex project
- `bun run check-types`: Check TypeScript types across all apps

## Documentation

- [POS_DOCUMENTATION.md](POS_DOCUMENTATION.md) - Complete feature guide
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup instructions
- [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture details
- [SEED_GUIDE.md](SEED_GUIDE.md) - How to use seed data
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Project overview

## Key Pages

- `/dashboard` - Overview with statistics and quick actions
- `/stores` - Store management (admin)
- `/inventory` - Product catalog and stock management
- `/pos` - Point of sale checkout interface
- `/reports` - Sales analytics and history

## Theme

The application features a modern **white and orange** color scheme:
- Clean white background for clarity
- Orange accents for primary actions and branding
- Professional design optimized for retail environments
