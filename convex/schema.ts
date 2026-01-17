import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	guildSettings: defineTable({
		guildId: v.string(),
		alertsChannelId: v.string(),
	}).index("by_guild", ["guildId"]),
});
