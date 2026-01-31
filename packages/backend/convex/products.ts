import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

// Create a product
export const create = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.string(),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    barcode: v.optional(v.string()),
    sku: v.string(),
    price: v.number(),
    cost: v.optional(v.number()),
    quantity: v.number(),
    minQuantity: v.number(),
    unit: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const productId = await ctx.db.insert("products", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return productId;
  },
});

// Get all products for a store
export const listByStore = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const products = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    return products;
  },
});

// Get a specific product
export const get = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const product = await ctx.db.get(args.productId);
    return product;
  },
});

// Search product by barcode
export const findByBarcode = query({
  args: { barcode: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const product = await ctx.db
      .query("products")
      .withIndex("by_barcode", (q) => q.eq("barcode", args.barcode))
      .first();

    return product;
  },
});

// Update product
export const update = mutation({
  args: {
    productId: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    barcode: v.optional(v.string()),
    sku: v.optional(v.string()),
    price: v.optional(v.number()),
    cost: v.optional(v.number()),
    quantity: v.optional(v.number()),
    minQuantity: v.optional(v.number()),
    unit: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const { productId, ...updates } = args;

    await ctx.db.patch(productId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return productId;
  },
});

// Update product quantity (for inventory management)
export const updateQuantity = mutation({
  args: {
    productId: v.id("products"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.patch(args.productId, {
      quantity: args.quantity,
      updatedAt: Date.now(),
    });

    return args.productId;
  },
});

// Delete product
export const remove = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.delete(args.productId);
    return { success: true };
  },
});

// Get low stock products
export const getLowStock = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const products = await ctx.db
      .query("products")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    // Filter products where quantity <= minQuantity
    return products.filter((p) => p.quantity <= p.minQuantity);
  },
});
