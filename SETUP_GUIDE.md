# Quick Setup Guide for POS System

This guide will help you get the POS system up and running quickly.

## Prerequisites

- Bun 1.3.8+ (or Node.js 20+)
- A Convex account (free at https://convex.dev)
- Git

## Step 1: Clone and Install

```bash
# Navigate to the project directory
cd Order-num

# Install dependencies
bun install
```

## Step 2: Set Up Convex Backend

```bash
# Initialize Convex
bun run dev:setup
```

This will:
1. Prompt you to log in to Convex (or create an account)
2. Create a new Convex project
3. Generate environment variables

## Step 3: Configure Environment Variables

After running `dev:setup`, copy the generated environment variables:

```bash
# Copy from packages/backend/.env.local
cp packages/backend/.env.local apps/web/.env
```

Your `.env` file should contain:
```
VITE_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOYMENT=your-deployment
CONVEX_URL=https://your-project.convex.cloud
SITE_URL=http://localhost:3001
```

## Step 4: Start the Development Server

```bash
# Start all services
bun run dev
```

This will start:
- Convex backend (syncing functions)
- Web application (http://localhost:3001)

## Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:3001
```

## First-Time Setup

### 1. Create an Account
- Click "Sign Up" on the landing page
- Enter your email and password
- Sign in with your credentials

### 2. Create Your First Store
- Navigate to "Stores" in the navigation
- Click "Create Store"
- Fill in the details:
  - **Store Name**: Your store name
  - **Owner ID**: Your user ID (from auth)
  - **Email**: Store contact email
  - **Phone**: Store phone number
  - **Address**: Store location
  - **Subscription**: Choose a plan (Free, Basic, Premium)
- Click "Create"

### 3. Add Products to Inventory
- Navigate to "Inventory"
- Select your store
- Click "Add Product"
- Enter product details:
  - Name, SKU, Barcode
  - Price and Cost
  - Initial Quantity
  - Minimum Quantity (for low stock alerts)
- Click "Add Product"
- Repeat for more products

### 4. Process Your First Sale
- Navigate to "POS"
- Select your store
- Search for a product or scan barcode
- Click product to add to cart
- Adjust quantities as needed
- Select payment method
- Click "Complete Sale"

### 5. View Reports
- Navigate to "Reports"
- Select your store
- View sales statistics
- Check sales history
- Review product performance

## Common Tasks

### Adding a Category
Currently categories are referenced in products but need to be created through the Convex dashboard or by adding a categories page.

### Managing Users
Users are created through the authentication system and can be assigned roles through the users table in Convex.

### Adjusting Stock Levels
Go to Inventory, find the product, and edit the quantity.

### Processing a Refund
Currently refunds can be processed through the Convex dashboard by updating the sale status and running the refund mutation.

## Troubleshooting

### Convex Connection Issues
- Ensure your `.env` file has the correct `VITE_CONVEX_URL`
- Check that Convex backend is running (`bun run dev:server`)
- Verify you're logged in to Convex CLI

### Build Failures
- Clear node_modules and reinstall: `rm -rf node_modules && bun install`
- Clear build cache: `rm -rf apps/web/.vinxi apps/web/dist`
- Rebuild: `bun run build`

### Authentication Issues
- Check that `SITE_URL` matches your development URL
- Verify Convex auth configuration in `packages/backend/convex/auth.config.ts`
- Clear browser cookies and try again

### Data Not Showing
- Ensure you're logged in
- Check browser console for errors
- Verify Convex functions are deployed (check Convex dashboard)

## Production Deployment

### 1. Build the Application
```bash
bun run build
```

### 2. Deploy Convex Backend
```bash
cd packages/backend
bunx convex deploy
```

### 3. Deploy Frontend
Deploy the `apps/web` directory to your hosting provider (Vercel, Netlify, etc.)

Update environment variables in your hosting provider:
- `VITE_CONVEX_URL`: Your production Convex URL
- `SITE_URL`: Your production domain

## Additional Resources

- [Convex Documentation](https://docs.convex.dev)
- [TanStack Start Documentation](https://tanstack.com/start)
- [Better Auth Documentation](https://www.better-auth.com)
- [TailwindCSS Documentation](https://tailwindcss.com)

## Support

For issues or questions:
1. Check the POS_DOCUMENTATION.md for detailed feature information
2. Review Convex logs in the dashboard
3. Check browser console for client-side errors
4. Review the GitHub repository issues

## Next Steps

Once set up, you can:
1. Customize the design in `apps/web/src/index.css`
2. Add more UI components from shadcn/ui
3. Extend the database schema in `packages/backend/convex/schema.ts`
4. Add new backend functions in `packages/backend/convex/`
5. Create new frontend pages in `apps/web/src/routes/`

Happy selling! 🛍️
