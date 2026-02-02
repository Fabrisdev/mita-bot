import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const openTicket = mutation({
	args: {
		guildId: v.string(),
		ownerId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("tickets", {
			guildId: args.guildId,
			ownerId: args.ownerId,
			status: "open",
		});
	},
});

export const closeTicket = mutation({
	args: {
		ticketId: v.id("tickets"),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch("tickets", args.ticketId, {
			status: "closed",
		});
	},
});

export const getTicketsFromGuild = query({
	args: {
		guildId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("tickets")
			.withIndex("by_guild", (q) => q.eq("guildId", args.guildId))
			.collect();
	},
});
