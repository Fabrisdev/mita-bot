import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const storeMessage = mutation({
	args: {
		ticketId: v.id("tickets"),
		message: v.object({
			authorId: v.string(),
			content: v.string(),
			sentAt: v.number(),
		}),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert("ticketMessages", {
			ticketId: args.ticketId,
			authorId: args.message.authorId,
			content: args.message.content,
			sentAt: args.message.sentAt,
		});
	},
});

export const getMessages = query({
	args: {
		ticketId: v.id("tickets"),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("ticketMessages")
			.withIndex("by_ticket", (q) => q.eq("ticketId", args.ticketId))
			.collect();
	},
});
