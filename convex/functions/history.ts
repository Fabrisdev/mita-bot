import { v } from "convex/values";
import { query } from "../_generated/server";

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
