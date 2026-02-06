import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const insertTempRole = mutation({
	args: {
		guildId: v.string(),
		userId: v.string(),
		roleId: v.string(),
		expiresOn: v.number(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("tempRoles", {
			guildId: args.guildId,
			userId: args.userId,
			roleId: args.roleId,
			expiresOn: args.expiresOn,
			alreadyRemoved: false,
		});
	},
});

export const getRolesToRemove = query({
	args: {
		now: v.number(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("tempRoles")
			.withIndex("by_already_removed", (q) => q.eq("alreadyRemoved", false))
			.filter((q) => q.lte(q.field("expiresOn"), args.now))
			.collect();
	},
});

export const markAsRemoved = mutation({
	args: {
		id: v.id("tempRoles"),
	},
	handler: async (ctx, args) => {
		return await ctx.db.patch("tempRoles", args.id, {
			alreadyRemoved: true,
		});
	},
});

export const getRoleToRemove = query({
	args: {
		id: v.id("tempRoles"),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("tempRoles")
			.withIndex("by_id", (q) => q.eq("_id", args.id))
			.first();
	},
});
