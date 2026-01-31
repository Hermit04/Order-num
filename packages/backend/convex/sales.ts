import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

// Create a sale
export const create = mutation({
  args: {
    storeId: v.id("stores"),
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
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Validate stock availability
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (!product) {
        throw new Error(`Product ${item.productName} not found`);
      }
      if (product.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${item.productName}. Available: ${product.quantity}, Required: ${item.quantity}`
        );
      }
    }

    // Generate sale number using timestamp to avoid collisions
    const timestamp = Date.now();
    const saleNumber = `SALE-${timestamp.toString().slice(-10)}`;

    // Create the sale
    const saleId = await ctx.db.insert("sales", {
      ...args,
      saleNumber,
      cashierId: user.id,
      status: "completed",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update product quantities
    for (const item of args.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          quantity: product.quantity - item.quantity,
          updatedAt: Date.now(),
        });
      }
    }

    return saleId;
  },
});

// Get all sales for a store
export const listByStore = query({
  args: { storeId: v.id("stores"), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    let query = ctx.db
      .query("sales")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .order("desc");

    if (args.limit) {
      query = query.take(args.limit);
    }

    const sales = await query.collect();
    return sales;
  },
});

// Get a specific sale
export const get = query({
  args: { saleId: v.id("sales") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const sale = await ctx.db.get(args.saleId);
    return sale;
  },
});

// Get sales by date range
export const getByDateRange = query({
  args: {
    storeId: v.id("stores"),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const sales = await ctx.db
      .query("sales")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .filter((q) =>
        q.and(q.gte(q.field("createdAt"), args.startDate), q.lte(q.field("createdAt"), args.endDate))
      )
      .collect();

    return sales;
  },
});

// Refund a sale
export const refund = mutation({
  args: { saleId: v.id("sales") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const sale = await ctx.db.get(args.saleId);
    if (!sale) throw new Error("Sale not found");

    // Update sale status
    await ctx.db.patch(args.saleId, {
      status: "refunded",
      updatedAt: Date.now(),
    });

    // Restore product quantities
    for (const item of sale.items) {
      const product = await ctx.db.get(item.productId);
      if (product) {
        await ctx.db.patch(item.productId, {
          quantity: product.quantity + item.quantity,
          updatedAt: Date.now(),
        });
      }
    }

    return args.saleId;
  },
});

// Get sales statistics
export const getStats = query({
  args: { storeId: v.id("stores"), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const days = args.days || 30;
    const startDate = Date.now() - days * 24 * 60 * 60 * 1000;

    const sales = await ctx.db
      .query("sales")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .filter((q) => q.gte(q.field("createdAt"), startDate))
      .collect();

    const completedSales = sales.filter((s) => s.status === "completed");

    const totalRevenue = completedSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalTransactions = completedSales.length;
    const averageTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      totalRevenue,
      totalTransactions,
      averageTransaction,
      totalRefunds: sales.filter((s) => s.status === "refunded").length,
    };
  },
});
