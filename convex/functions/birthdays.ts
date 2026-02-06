import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const setBirthday = mutation({
	args: {
		guildId: v.string(),
		userId: v.string(),
		month: v.number(),
		day: v.number(),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("birthdays")
			.withIndex("by_user", (q) =>
				q.eq("guildId", args.guildId).eq("userId", args.userId),
			)
			.first();

		if (existing) {
			await ctx.db.patch(existing._id, {
				month: args.month,
				day: args.day,
			});
			return existing._id;
		}

		return await ctx.db.insert("birthdays", {
			guildId: args.guildId,
			userId: args.userId,
			month: args.month,
			day: args.day,
		});
	},
});

export const getBirthdaysToday = query({
	args: {
		guildId: v.string(),
		month: v.number(),
		day: v.number(),
	},
	handler: async (ctx, args) => {
		return await ctx.db
			.query("birthdays")
			.withIndex("by_date", (q) =>
				q
					.eq("guildId", args.guildId)
					.eq("month", args.month)
					.eq("day", args.day),
			)
			.collect();
	},
});

export const updateLastCelebratedYear = mutation({
	args: {
		id: v.id("birthdays"),
		year: v.number(),
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, {
			lastCelebratedYear: args.year,
		});
	},
});
