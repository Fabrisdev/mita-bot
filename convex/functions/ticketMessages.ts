import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const storeMessages = mutation({
	args: {
		ticketId: v.id("tickets"),
		messages: v.array(
			v.object({
				authorId: v.string(),
				content: v.string(),
				sentAt: v.number(),
			}),
		),
	},
	handler: async (ctx, args) => {
		for (const message of args.messages) {
			await ctx.db.insert("ticketMessages", {
				ticketId: args.ticketId,
				authorId: message.authorId,
				content: message.content,
				sentAt: message.sentAt,
			});
		}
	},
});
