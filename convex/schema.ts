import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	guildSettings: defineTable({
		guildId: v.string(),
		alertsChannelId: v.string(),
	}).index("by_guild", ["guildId"]),
	history: defineTable({
		guildId: v.string(),
		userId: v.string(),
		history: v.array(
			v.object({
				type: v.union(
					v.literal("ban"),
					v.literal("unban"),
					v.literal("kick"),
					v.literal("mute"),
					v.literal("warn"),
				),
				at: v.number(),
				moderatorId: v.string(),
				reason: v.string(),
			}),
		),
	}).index("by_user_and_guild", ["guildId", "userId"]),
	tickets: defineTable({
		guildId: v.string(),
		channelId: v.string(),
		ownerId: v.string(),
		status: v.union(v.literal("open"), v.literal("closed")),
		closedAt: v.optional(v.number()),
	}).index("by_guild", ["guildId"]),
	ticketMessages: defineTable({
		ticketId: v.id("tickets"),
		authorId: v.string(),
		content: v.string(),
		sentAt: v.number(),
	}).index("by_ticket", ["ticketId"]),
});
