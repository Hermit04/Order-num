# Seed Data Guide

This guide explains how to populate your POS system with initial sample data for testing and demonstration purposes.

## What the Seed Creates

The seed function (`seed:seedData`) creates a complete sample dataset including:

### Users
- **1 Admin User** (System Administrator)
  - Email: admin@ordernum.com
  - Role: Admin (full system access)

- **1 Store Owner** (John Orange)
  - Email: john@orangegrove.com
  - Role: Store Owner
  - Associated with Orange Grove Market

- **1 Cashier** (Jane Cashier)
  - Email: jane@orangegrove.com
  - Role: Cashier
  - Associated with Orange Grove Market

### Store
- **Orange Grove Market**
  - Premium subscription (1 year)
  - Complete contact information
  - Active status

### Categories (5)
1. Electronics
2. Food & Beverages
3. Clothing
4. Home & Garden
5. Sports & Outdoors

### Products (12)
Sample products across all categories with:
- Realistic names and descriptions
- Unique barcodes and SKUs
- Price and cost information
- Current stock quantities
- Minimum quantity thresholds for alerts

**Sample Products:**
- Wireless Mouse ($29.99)
- USB-C Cable ($12.99)
- Bluetooth Headphones ($89.99)
- Orange Juice ($8.99)
- Organic Oranges ($5.99)
- And 7 more...

### Sales Transactions (5)
- Multiple completed sales over the past 5 days
- Different payment methods (cash, card, mobile)
- Multiple items per transaction
- Realistic totals with 10% tax

### Barcode Scans (5)
- Recent scan history for tracking

## How to Run the Seed

### Option 1: From Convex Dashboard (Recommended)

1. Open your Convex dashboard: https://dashboard.convex.dev
2. Select your project
3. Go to the **Functions** tab
4. Find the `seed:seedData` function
5. Click **Run**
6. Watch the console output for progress
7. Wait for the success message

### Option 2: From Command Line

```bash
# Navigate to the backend directory
cd packages/backend

# Run the seed function
npx convex run seed:seedData

# Or if you're using bun
bunx convex run seed:seedData
```

### Option 3: From Code

You can also call the seed function from your application code if needed:

```typescript
import { api } from "@Order-num/backend/convex/_generated/api";

// In a React component or server function
const result = await convex.mutation(api.seed.seedData, {});
console.log(result.message);
```

## Clearing Data (Optional)

If you need to reset the database and run the seed again:

### From Convex Dashboard
1. Run the `seed:clearAllData` function first
2. Then run `seed:seedData` again

### From Command Line
```bash
npx convex run seed:clearAllData
npx convex run seed:seedData
```

**⚠️ Warning:** `clearAllData` will delete ALL data in your database. Use with caution!

## After Seeding

Once the seed data is created, you can:

1. **Log into the application** using the created user credentials
2. **Explore the Dashboard** to see stats and recent activity
3. **View Stores** to see Orange Grove Market
4. **Browse Inventory** to see all 12 products
5. **Check Reports** to see the 5 sample sales transactions
6. **Use the POS** to create new sales with the sample products

## Customizing the Seed

To customize the seed data, edit `/packages/backend/convex/seed.ts`:

- Modify the `products` array to add/remove/change products
- Adjust the `categories` array for different categories
- Change the `salesData` array to create different transactions
- Update user information (names, emails, etc.)

## Troubleshooting

### "Unauthorized" Error
The seed function doesn't require authentication, but if you get this error:
- Make sure you're running it from the Convex dashboard or CLI
- Check that your Convex deployment is properly configured

### "Table already exists" Error
If you're getting duplicate data errors:
1. Run `seed:clearAllData` first
2. Then run `seed:seedData` again

### Seed Takes Too Long
The seed function creates 30+ database records, which may take a few seconds:
- This is normal
- Watch the console output for progress
- Wait for the "🎉 Seed data generation completed successfully!" message

## Production Considerations

**Important:** This seed function is designed for development and testing only.

For production:
- Don't run the seed function
- Create real admin users through proper authentication
- Let store owners create their own stores
- Use the UI to add real products and categories
- Real sales will be created through the POS interface

## Next Steps

After running the seed:
1. Review the [POS_DOCUMENTATION.md](../../POS_DOCUMENTATION.md) for feature details
2. Check the [SETUP_GUIDE.md](../../SETUP_GUIDE.md) for configuration options
3. Start exploring the application!

---

**Need Help?**
- Check the main README.md for general setup instructions
- Review the ARCHITECTURE.md for technical details
- Consult the Convex documentation for database operations
