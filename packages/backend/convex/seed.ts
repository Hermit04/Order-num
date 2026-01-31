import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Seed function to populate initial data for the POS system
 * This creates an admin user, sample store, categories, products, and sales
 * 
 * Run this function from the Convex dashboard or CLI:
 * npx convex run seed:seedData
 */
export const seedData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🌱 Starting seed data generation...");
    
    // 1. Create Admin User (App Owner)
    console.log("📝 Creating admin user...");
    const adminUserId = "admin-seed-001"; // This would normally come from auth
    const adminUser = await ctx.db.insert("users", {
      userId: adminUserId,
      role: "admin",
      name: "System Administrator",
      email: "admin@ordernum.com",
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ Admin user created:", adminUser);

    // 2. Create Sample Store with Premium Subscription
    console.log("🏪 Creating sample store...");
    const storeId = await ctx.db.insert("stores", {
      name: "Orange Grove Market",
      ownerId: adminUserId,
      email: "store@orangegrove.com",
      phone: "+1-555-0123",
      address: "123 Main Street, Orange County, CA 92602",
      subscriptionType: "premium",
      subscriptionStatus: "active",
      subscriptionExpiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 year
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ Store created:", storeId);

    // 3. Create Store Owner User
    console.log("👤 Creating store owner...");
    const ownerUserId = "owner-seed-001";
    const ownerUser = await ctx.db.insert("users", {
      userId: ownerUserId,
      storeId: storeId,
      role: "store_owner",
      name: "John Orange",
      email: "john@orangegrove.com",
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ Store owner created:", ownerUser);

    // 4. Create Cashier User
    console.log("👤 Creating cashier...");
    const cashierUserId = "cashier-seed-001";
    const cashierUser = await ctx.db.insert("users", {
      userId: cashierUserId,
      storeId: storeId,
      role: "cashier",
      name: "Jane Cashier",
      email: "jane@orangegrove.com",
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    console.log("✅ Cashier created:", cashierUser);

    // 5. Create Categories
    console.log("📂 Creating categories...");
    const categories = [
      { name: "Electronics", description: "Electronic devices and accessories" },
      { name: "Food & Beverages", description: "Fresh food and drinks" },
      { name: "Clothing", description: "Apparel and fashion items" },
      { name: "Home & Garden", description: "Home improvement and garden supplies" },
      { name: "Sports & Outdoors", description: "Sports equipment and outdoor gear" },
    ];

    const categoryIds: Record<string, any> = {};
    for (const category of categories) {
      const categoryId = await ctx.db.insert("categories", {
        storeId: storeId,
        name: category.name,
        description: category.description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      categoryIds[category.name] = categoryId;
      console.log(`  ✅ Category created: ${category.name}`);
    }

    // 6. Create Sample Products
    console.log("📦 Creating products...");
    const products = [
      // Electronics
      {
        name: "Wireless Mouse",
        description: "Ergonomic wireless mouse with USB receiver",
        categoryId: categoryIds["Electronics"],
        barcode: "123456789012",
        sku: "ELEC-001",
        price: 29.99,
        cost: 15.00,
        quantity: 50,
        minQuantity: 10,
        unit: "pcs",
      },
      {
        name: "USB-C Cable",
        description: "6ft USB-C charging cable",
        categoryId: categoryIds["Electronics"],
        barcode: "123456789013",
        sku: "ELEC-002",
        price: 12.99,
        cost: 5.00,
        quantity: 100,
        minQuantity: 20,
        unit: "pcs",
      },
      {
        name: "Bluetooth Headphones",
        description: "Over-ear wireless headphones with noise cancellation",
        categoryId: categoryIds["Electronics"],
        barcode: "123456789014",
        sku: "ELEC-003",
        price: 89.99,
        cost: 45.00,
        quantity: 25,
        minQuantity: 5,
        unit: "pcs",
      },
      // Food & Beverages
      {
        name: "Orange Juice",
        description: "Fresh squeezed orange juice - 1 gallon",
        categoryId: categoryIds["Food & Beverages"],
        barcode: "223456789012",
        sku: "FOOD-001",
        price: 8.99,
        cost: 4.00,
        quantity: 75,
        minQuantity: 15,
        unit: "gallon",
      },
      {
        name: "Organic Oranges",
        description: "Fresh organic oranges",
        categoryId: categoryIds["Food & Beverages"],
        barcode: "223456789013",
        sku: "FOOD-002",
        price: 5.99,
        cost: 2.50,
        quantity: 200,
        minQuantity: 30,
        unit: "lb",
      },
      {
        name: "Bottled Water",
        description: "24-pack of purified bottled water",
        categoryId: categoryIds["Food & Beverages"],
        barcode: "223456789014",
        sku: "FOOD-003",
        price: 6.99,
        cost: 3.00,
        quantity: 150,
        minQuantity: 25,
        unit: "pack",
      },
      // Clothing
      {
        name: "Orange T-Shirt",
        description: "100% cotton orange t-shirt - Medium",
        categoryId: categoryIds["Clothing"],
        barcode: "323456789012",
        sku: "CLOTH-001",
        price: 19.99,
        cost: 8.00,
        quantity: 60,
        minQuantity: 10,
        unit: "pcs",
      },
      {
        name: "Baseball Cap",
        description: "Adjustable baseball cap with logo",
        categoryId: categoryIds["Clothing"],
        barcode: "323456789013",
        sku: "CLOTH-002",
        price: 24.99,
        cost: 10.00,
        quantity: 40,
        minQuantity: 8,
        unit: "pcs",
      },
      // Home & Garden
      {
        name: "Garden Gloves",
        description: "Heavy-duty gardening gloves",
        categoryId: categoryIds["Home & Garden"],
        barcode: "423456789012",
        sku: "HOME-001",
        price: 14.99,
        cost: 6.00,
        quantity: 80,
        minQuantity: 15,
        unit: "pair",
      },
      {
        name: "Plant Fertilizer",
        description: "All-purpose plant fertilizer - 5lb bag",
        categoryId: categoryIds["Home & Garden"],
        barcode: "423456789013",
        sku: "HOME-002",
        price: 22.99,
        cost: 10.00,
        quantity: 45,
        minQuantity: 10,
        unit: "bag",
      },
      // Sports & Outdoors
      {
        name: "Basketball",
        description: "Official size basketball",
        categoryId: categoryIds["Sports & Outdoors"],
        barcode: "523456789012",
        sku: "SPORT-001",
        price: 39.99,
        cost: 20.00,
        quantity: 30,
        minQuantity: 5,
        unit: "pcs",
      },
      {
        name: "Yoga Mat",
        description: "Non-slip exercise yoga mat",
        categoryId: categoryIds["Sports & Outdoors"],
        barcode: "523456789013",
        sku: "SPORT-002",
        price: 29.99,
        cost: 12.00,
        quantity: 35,
        minQuantity: 8,
        unit: "pcs",
      },
    ];

    const productIds: any[] = [];
    for (const product of products) {
      const productId = await ctx.db.insert("products", {
        storeId: storeId,
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        barcode: product.barcode,
        sku: product.sku,
        price: product.price,
        cost: product.cost,
        quantity: product.quantity,
        minQuantity: product.minQuantity,
        unit: product.unit,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      productIds.push({ id: productId, ...product });
      console.log(`  ✅ Product created: ${product.name}`);
    }

    // 7. Create Sample Sales Transactions
    console.log("💰 Creating sample sales...");
    const salesData = [
      {
        items: [
          { 
            productId: productIds[0].id, 
            productName: productIds[0].name,
            quantity: 2, 
            price: productIds[0].price,
            subtotal: productIds[0].price * 2 
          },
          { 
            productId: productIds[3].id, 
            productName: productIds[3].name,
            quantity: 1, 
            price: productIds[3].price,
            subtotal: productIds[3].price 
          },
        ],
        paymentMethod: "card" as const,
        daysAgo: 5,
      },
      {
        items: [
          { 
            productId: productIds[2].id, 
            productName: productIds[2].name,
            quantity: 1, 
            price: productIds[2].price,
            subtotal: productIds[2].price 
          },
        ],
        paymentMethod: "cash" as const,
        daysAgo: 3,
      },
      {
        items: [
          { 
            productId: productIds[4].id, 
            productName: productIds[4].name,
            quantity: 3, 
            price: productIds[4].price,
            subtotal: productIds[4].price * 3 
          },
          { 
            productId: productIds[5].id, 
            productName: productIds[5].name,
            quantity: 2, 
            price: productIds[5].price,
            subtotal: productIds[5].price * 2 
          },
        ],
        paymentMethod: "card" as const,
        daysAgo: 2,
      },
      {
        items: [
          { 
            productId: productIds[6].id, 
            productName: productIds[6].name,
            quantity: 2, 
            price: productIds[6].price,
            subtotal: productIds[6].price * 2 
          },
          { 
            productId: productIds[7].id, 
            productName: productIds[7].name,
            quantity: 1, 
            price: productIds[7].price,
            subtotal: productIds[7].price 
          },
        ],
        paymentMethod: "mobile" as const,
        daysAgo: 1,
      },
      {
        items: [
          { 
            productId: productIds[10].id, 
            productName: productIds[10].name,
            quantity: 1, 
            price: productIds[10].price,
            subtotal: productIds[10].price 
          },
          { 
            productId: productIds[11].id, 
            productName: productIds[11].name,
            quantity: 1, 
            price: productIds[11].price,
            subtotal: productIds[11].price 
          },
        ],
        paymentMethod: "cash" as const,
        daysAgo: 0,
      },
    ];

    for (let i = 0; i < salesData.length; i++) {
      const sale = salesData[i];
      const subtotal = sale.items.reduce((sum, item) => sum + item.subtotal, 0);
      const tax = subtotal * 0.1; // 10% tax
      const total = subtotal + tax;
      const createdAt = Date.now() - (sale.daysAgo * 24 * 60 * 60 * 1000);
      
      const saleId = await ctx.db.insert("sales", {
        storeId: storeId,
        saleNumber: `SALE-${createdAt.toString().slice(-10)}`,
        cashierId: cashierUserId,
        items: sale.items,
        subtotal,
        tax,
        discount: 0,
        total,
        paymentMethod: sale.paymentMethod,
        status: "completed",
        createdAt,
        updatedAt: createdAt,
      });
      console.log(`  ✅ Sale created: SALE-${i + 1}`);
    }

    // 8. Create some barcode scans
    console.log("📱 Creating barcode scan logs...");
    for (let i = 0; i < 5; i++) {
      const product = productIds[i];
      await ctx.db.insert("barcodeScans", {
        storeId: storeId,
        barcode: product.barcode,
        productId: product.id,
        scannedBy: cashierUserId,
        successful: true,
        createdAt: Date.now() - (i * 60 * 60 * 1000), // Scanned over last few hours
      });
    }
    console.log("  ✅ Barcode scans logged");

    console.log("\n🎉 Seed data generation completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`  - 3 users created (1 admin, 1 owner, 1 cashier)`);
    console.log(`  - 1 store created (Orange Grove Market)`);
    console.log(`  - 5 categories created`);
    console.log(`  - 12 products created`);
    console.log(`  - 5 sales transactions created`);
    console.log(`  - 5 barcode scans logged`);
    console.log("\n✅ You can now log in and explore the system!");

    return {
      success: true,
      adminUser: adminUser,
      store: storeId,
      message: "Seed data created successfully",
    };
  },
});

/**
 * Clear all data from the database (use with caution!)
 * This is useful for testing the seed function multiple times
 */
export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("🗑️ Clearing all data...");
    
    // Delete in reverse order of dependencies
    const sales = await ctx.db.query("sales").collect();
    for (const sale of sales) {
      await ctx.db.delete(sale._id);
    }
    
    const barcodeScans = await ctx.db.query("barcodeScans").collect();
    for (const scan of barcodeScans) {
      await ctx.db.delete(scan._id);
    }
    
    const products = await ctx.db.query("products").collect();
    for (const product of products) {
      await ctx.db.delete(product._id);
    }
    
    const categories = await ctx.db.query("categories").collect();
    for (const category of categories) {
      await ctx.db.delete(category._id);
    }
    
    const stores = await ctx.db.query("stores").collect();
    for (const store of stores) {
      await ctx.db.delete(store._id);
    }
    
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
      await ctx.db.delete(user._id);
    }
    
    console.log("✅ All data cleared!");
    return { success: true, message: "All data cleared" };
  },
});
