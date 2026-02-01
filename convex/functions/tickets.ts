import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const openTicket = mutation({
	args: {
		guildId: v.string(),
		ownerId: v.string(),
	},
	handler: async (ctx, args) => {
		ctx.db.insert("tickets", {
			guildId: args.guildId,
			ownerId: args.guildId,
			status: "open",
		});
	},
});
