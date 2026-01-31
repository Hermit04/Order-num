import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

// Create a new store (admin only)
export const create = mutation({
  args: {
    name: v.string(),
    ownerId: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    subscriptionType: v.union(v.literal("free"), v.literal("basic"), v.literal("premium")),
  },
  handler: async (ctx, args) => {
    // Check if user is admin
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    // Calculate subscription expiry (30 days from now)
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;

    const storeId = await ctx.db.insert("stores", {
      name: args.name,
      ownerId: args.ownerId,
      email: args.email,
      phone: args.phone,
      address: args.address,
      subscriptionType: args.subscriptionType,
      subscriptionStatus: "active",
      subscriptionExpiresAt: expiresAt,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return storeId;
  },
});

// Get all stores (admin only)
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const stores = await ctx.db.query("stores").collect();
    return stores;
  },
});

// Get a specific store
export const get = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return null;

    const store = await ctx.db.get(args.storeId);
    return store;
  },
});

// Update store
export const update = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
    subscriptionType: v.optional(
      v.union(v.literal("free"), v.literal("basic"), v.literal("premium"))
    ),
    subscriptionStatus: v.optional(
      v.union(v.literal("active"), v.literal("inactive"), v.literal("suspended"))
    ),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const { storeId, ...updates } = args;

    await ctx.db.patch(storeId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return storeId;
  },
});

// Delete store
export const remove = mutation({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.delete(args.storeId);
    return { success: true };
  },
});

// Get stores by owner
export const getByOwner = query({
  args: { ownerId: v.string() },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const stores = await ctx.db
      .query("stores")
      .withIndex("by_owner", (q) => q.eq("ownerId", args.ownerId))
      .collect();

    return stores;
  },
});
