import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

// Create a user
export const create = mutation({
  args: {
    userId: v.string(),
    storeId: v.optional(v.id("stores")),
    role: v.union(
      v.literal("admin"),
      v.literal("store_owner"),
      v.literal("cashier"),
      v.literal("manager")
    ),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.getAuthUser(ctx);
    if (!currentUser) throw new Error("Unauthorized");

    const userId = await ctx.db.insert("users", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return userId;
  },
});

// Get all users
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// Get users by store
export const listByStore = query({
  args: { storeId: v.id("stores") },
  handler: async (ctx, args) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];

    const users = await ctx.db
      .query("users")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId))
      .collect();

    return users;
  },
});

// Get user by userId (auth user id)
export const getByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const currentUser = await authComponent.safeGetAuthUser(ctx);
    if (!currentUser) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    return user;
  },
});

// Update user
export const update = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(
      v.union(
        v.literal("admin"),
        v.literal("store_owner"),
        v.literal("cashier"),
        v.literal("manager")
      )
    ),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const { id, ...updates } = args;

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return id;
  },
});

// Delete user
export const remove = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await authComponent.getAuthUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
