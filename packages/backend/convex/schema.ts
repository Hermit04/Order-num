import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Stores table - for managing different stores
  stores: defineTable({
    name: v.string(),
    ownerId: v.string(), // Reference to user
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    subscriptionType: v.union(v.literal("free"), v.literal("basic"), v.literal("premium")),
    subscriptionStatus: v.union(v.literal("active"), v.literal("inactive"), v.literal("suspended")),
    subscriptionExpiresAt: v.number(), // timestamp
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_subscription_status", ["subscriptionStatus"]),

  // Users table - for role management
  users: defineTable({
    userId: v.string(), // Reference to auth user
    storeId: v.optional(v.id("stores")), // null for admin users
    role: v.union(
      v.literal("admin"),
      v.literal("store_owner"),
      v.literal("cashier"),
      v.literal("manager")
    ),
    name: v.string(),
    email: v.string(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_id", ["userId"])
    .index("by_store", ["storeId"])
    .index("by_role", ["role"]),

  // Categories table
  categories: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_store", ["storeId"]),

  // Products/Inventory table
  products: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    barcode: v.optional(v.string()),
    sku: v.string(),
    price: v.number(),
    cost: v.optional(v.number()),
    quantity: v.number(),
    minQuantity: v.number(), // for low stock alerts
    unit: v.optional(v.string()), // e.g., "pcs", "kg", "liter"
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_barcode", ["barcode"])
    .index("by_sku", ["sku"])
    .index("by_category", ["categoryId"]),

  // Sales/Transactions table
  sales: defineTable({
    storeId: v.id("stores"),
    saleNumber: v.string(), // e.g., "SALE-001"
    cashierId: v.string(), // Reference to user
    items: v.array(
      v.object({
        productId: v.id("products"),
        productName: v.string(),
        quantity: v.number(),
        price: v.number(),
        subtotal: v.number(),
      })
    ),
    subtotal: v.number(),
    tax: v.number(),
    discount: v.number(),
    total: v.number(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("card"),
      v.literal("mobile"),
      v.literal("other")
    ),
    status: v.union(v.literal("completed"), v.literal("refunded"), v.literal("cancelled")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_cashier", ["cashierId"])
    .index("by_sale_number", ["saleNumber"])
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),

  // Barcode scans log (for tracking)
  barcodeScans: defineTable({
    storeId: v.id("stores"),
    barcode: v.string(),
    productId: v.optional(v.id("products")),
    scannedBy: v.string(), // Reference to user
    successful: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_store", ["storeId"])
    .index("by_barcode", ["barcode"]),
});
