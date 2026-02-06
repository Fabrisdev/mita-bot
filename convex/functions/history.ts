import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getUserHistory = query({
	args: {
		guildId: v.string(),
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("history")
			.withIndex("by_user_and_guild", (q) => q.eq("guildId", args.guildId))
			.filter((q) => q.eq(q.field("userId"), args.userId))
			.first();
	},
});

export const addToUserHistory = mutation({
	args: {
		guildId: v.string(),
		userId: v.string(),
		incident: v.object({
			type: v.union(
				v.literal("ban"),
				v.literal("unban"),
				v.literal("kick"),
				v.literal("timeout"),
				v.literal("warn"),
			),
			at: v.number(),
			moderatorId: v.string(),
			reason: v.string(),
		}),
	},
	handler: async (ctx, args) => {
		const history = await ctx.db
			.query("history")
			.withIndex("by_user_and_guild", (q) => q.eq("guildId", args.guildId))
			.filter((q) => q.eq(q.field("userId"), args.userId))
			.first();
		if (history) {
			await ctx.db.patch(history._id, {
				history: [...history.history, args.incident],
			});
			return;
		}
		await ctx.db.insert("history", {
			guildId: args.guildId,
			userId: args.userId,
			history: [args.incident],
		});
	},
});
