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
		const tickets = await ctx.db
			.query("tickets")
			.withIndex("by_guild", (q) => q.eq("guildId", args.guildId))
			.collect();
		const ticketsIds = tickets.map((ticket) => ticket._id);
		const messages = await ctx.db
			.query("ticketMessages")
			.filter((q) =>
				q.or(...ticketsIds.map((id) => q.eq(q.field("ticketId"), id))),
			)
			.collect();
		return tickets.map((ticket) => ({
			...ticket,
			messages: messages.filter((message) => message.ticketId === ticket._id),
		}));
	},
});
